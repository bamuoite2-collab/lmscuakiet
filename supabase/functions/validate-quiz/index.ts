import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's auth to verify the JWT
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    const { quizId, answers, startTime, reviewOnly, essayAnswers } = await req.json();
    
    if (!quizId || !answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body. Required: quizId and answers array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isReviewMode = reviewOnly === true;

    // Create Supabase client with service role to access full quiz_questions data
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch questions with correct answers (using service role bypasses RLS)
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, correct_answer, explanation, question, options, question_type')
      .eq('quiz_id', quizId)
      .order('order_index');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch quiz questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found or has no questions' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if quiz has essay questions
    const hasEssayQuestions = questions.some(q => q.question_type === 'essay');

    // Build user answers map for storage
    const userAnswersMap: Record<string, number | string | null> = {};
    answers.forEach((a: { questionId: string; answer: number | string }) => {
      userAnswersMap[a.questionId] = a.answer === -1 ? null : a.answer;
    });

    // Add essay answers if provided
    if (essayAnswers && typeof essayAnswers === 'object') {
      Object.entries(essayAnswers).forEach(([questionId, answer]) => {
        userAnswersMap[questionId] = answer as string;
      });
    }

    // Validate answers and calculate score (only for non-essay questions)
    let score = 0;
    let totalGradableQuestions = 0;
    
    const results = questions.map((question) => {
      const isEssay = question.question_type === 'essay';
      const userAnswer = answers.find((a: { questionId: string; answer: number | string }) => a.questionId === question.id);
      const essayAnswer = essayAnswers?.[question.id] || null;
      
      if (isEssay) {
        // Essay questions - pending grading
        return {
          questionId: question.id,
          question: question.question,
          options: question.options,
          userAnswer: essayAnswer,
          correctAnswer: null, // No correct answer for essays
          isCorrect: null, // Pending grading
          isEssay: true,
          explanation: question.explanation,
        };
      } else {
        // Multiple choice / true-false questions
        totalGradableQuestions++;
        const isCorrect = userAnswer?.answer === question.correct_answer;
        if (isCorrect) score++;

        return {
          questionId: question.id,
          question: question.question,
          options: question.options,
          userAnswer: userAnswer?.answer ?? null,
          correctAnswer: question.correct_answer,
          isCorrect,
          isEssay: false,
          explanation: question.explanation,
        };
      }
    });

    // Calculate time taken (in seconds)
    let timeTakenSeconds: number | null = null;
    if (startTime) {
      const start = new Date(startTime).getTime();
      const end = Date.now();
      timeTakenSeconds = Math.floor((end - start) / 1000);
    }

    // Determine status based on whether quiz has essay questions
    const status = hasEssayQuestions ? 'pending_grade' : 'completed';

    // Save quiz attempt directly to database (server-side, cannot be manipulated)
    // Skip saving if in review mode
    let attemptData = null;
    if (!isReviewMode) {
      const { data, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          score: score,
          total_questions: questions.length,
          time_taken_seconds: timeTakenSeconds,
          user_answers: userAnswersMap,
          completed_at: new Date().toISOString(),
          status: status,
          essay_scores: [],
          essay_feedback: [],
        })
        .select('id')
        .single();

      if (attemptError) {
        console.error('Error saving quiz attempt:', attemptError);
        // Don't fail the request, just log the error - student should still see results
      } else {
        attemptData = data;
        console.log(`Quiz attempt saved with ID: ${attemptData?.id}, status: ${status}`);
        
        // If has essay questions, trigger notification edge function
        if (hasEssayQuestions && attemptData?.id) {
          try {
            // Fetch quiz title and student info for notification
            const { data: quizData } = await supabase
              .from('quizzes')
              .select('title')
              .eq('id', quizId)
              .single();
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', user.id)
              .single();

            // Call notification function asynchronously (fire and forget)
            fetch(`${supabaseUrl}/functions/v1/notify-pending-grade`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                attemptId: attemptData.id,
                quizTitle: quizData?.title || 'Unknown Quiz',
                studentName: profileData?.full_name || user.email || 'Unknown Student',
                studentEmail: user.email,
              }),
            }).catch(err => console.error('Failed to send notification:', err));
          } catch (notifyError) {
            console.error('Error preparing notification:', notifyError);
          }
        }
      }
    }

    const logMessage = isReviewMode ? 'reviewed' : 'submitted';
    console.log(`Quiz ${quizId} ${logMessage} by user ${user.id}: ${score}/${totalGradableQuestions}${!isReviewMode ? ` in ${timeTakenSeconds}s` : ''}, status: ${status}`);

    return new Response(
      JSON.stringify({
        score,
        totalQuestions: questions.length,
        totalGradableQuestions,
        results,
        userId: user.id,
        attemptId: attemptData?.id || null,
        timeTakenSeconds,
        hasEssayQuestions,
        status,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-quiz function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
