import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EssayScore {
  question_id: string;
  score: number;
  max_score: number;
}

interface EssayFeedback {
  question_id: string;
  feedback: string;
}

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
        JSON.stringify({ error: 'Unauthorized' }),
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
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client to check admin status and update
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { attemptId, essayScores, essayFeedback } = await req.json();
    
    if (!attemptId) {
      return new Response(
        JSON.stringify({ error: 'Missing attemptId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.id} grading attempt ${attemptId}`);

    // Fetch the current attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (attemptError || !attempt) {
      console.error('Attempt not found:', attemptError);
      return new Response(
        JSON.stringify({ error: 'Quiz attempt not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total essay score
    let essayScoreTotal = 0;
    let essayMaxScore = 0;
    if (essayScores && Array.isArray(essayScores)) {
      essayScores.forEach((es: EssayScore) => {
        essayScoreTotal += es.score;
        essayMaxScore += es.max_score;
      });
    }

    // Calculate new total score (original MC score + essay scores)
    // We assume essay questions are worth the same as MC questions for simplicity
    // The original score is from MC questions only
    const originalMcScore = attempt.score;
    const newTotalScore = originalMcScore + essayScoreTotal;

    // Update the attempt with grading data
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'completed',
        essay_scores: essayScores || [],
        essay_feedback: essayFeedback || [],
        graded_by: user.id,
        graded_at: new Date().toISOString(),
        score: newTotalScore,
      })
      .eq('id', attemptId);

    if (updateError) {
      console.error('Error updating attempt:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update quiz attempt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Attempt ${attemptId} graded: MC=${originalMcScore}, Essay=${essayScoreTotal}/${essayMaxScore}, Total=${newTotalScore}`);

    return new Response(
      JSON.stringify({
        success: true,
        attemptId,
        originalMcScore,
        essayScoreTotal,
        essayMaxScore,
        newTotalScore,
        gradedBy: user.id,
        gradedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in grade-essay function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
