import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use Google Gemini API Key directly
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, imageBase64, mimeType } = await req.json();

    // Validate input - either text or image is required
    if (!text && !imageBase64) {
      return new Response(JSON.stringify({ error: "Text hoặc ảnh là bắt buộc" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isImageInput = !!imageBase64;
    console.log(`Parsing quiz for user ${user.id}, input type: ${isImageInput ? "image" : "text"}`);

    // Enhanced system prompt for better LaTeX/chemistry recognition
    const systemPrompt = `Bạn là trợ lý soạn đề Hóa học/KHTN chuyên nghiệp. Nhiệm vụ của bạn là phân tích nội dung (văn bản hoặc ảnh) và chuyển thành JSON chuẩn.

## QUAN TRỌNG - QUY TẮC LATEX HÓA HỌC:

1. **Công thức hóa học** PHẢI sử dụng \\ce{} trong môi trường $ $:
   - Đúng: $\\ce{H2SO4}$, $\\ce{NaOH}$, $\\ce{Al2(SO4)3}$
   - Sai: H2SO4, NaOH, Al2(SO4)3

2. **Phản ứng hóa học** sử dụng mũi tên trong \\ce{}:
   - Phản ứng thuận: $\\ce{A + B -> C + D}$
   - Phản ứng thuận nghịch: $\\ce{A + B <=> C + D}$
   - Điều kiện: $\\ce{A ->[\\text{nhiệt độ}] B}$
   - Ví dụ: $\\ce{2Al + 6HCl -> 2AlCl3 + 3H2 ^}$

3. **Ion và điện tích**:
   - Ion: $\\ce{Na+}$, $\\ce{SO4^{2-}}$, $\\ce{Al^{3+}}$
   - Electron: $\\ce{e-}$

4. **Chỉ số và hệ số**:
   - Chỉ số dưới tự động: $\\ce{H2O}$
   - Hệ số: $\\ce{2H2O}$
   - Chỉ số phức tạp: $\\ce{Ca(OH)2}$, $\\ce{[Fe(CN)6]^{4-}}$

5. **Ký hiệu đặc biệt**:
   - Kết tủa: $\\ce{v}$ hoặc mũi tên xuống
   - Khí thoát ra: $\\ce{^}$ hoặc mũi tên lên
   - Chất rắn/lỏng/khí: (r), (l), (k) hoặc (s), (l), (g)

6. **Công thức toán học**:
   - Phân số: $\\frac{m}{M}$
   - Chỉ số: $n_{H_2}$, $V_{O_2}$
   - Căn bậc: $\\sqrt{2}$

## FORMAT JSON TRẢ VỀ:

{
  "questions": [
    {
      "question": "Nội dung câu hỏi với LaTeX chuẩn",
      "question_type": "multiple_choice" | "true_false" | "essay",
      "options": ["A. đáp án A", "B. đáp án B", "C. đáp án C", "D. đáp án D"],
      "correct_answer": 0,
      "explanation": "Lời giải chi tiết với LaTeX"
    }
  ]
}

## QUY TẮC:
- options: mảng 4 phần tử cho trắc nghiệm, ["Đúng", "Sai"] cho đúng/sai, [] cho tự luận
- correct_answer: chỉ số 0-3 (hoặc 0-1 cho đúng/sai), -1 nếu không xác định
- explanation: PHẢI giải thích chi tiết cách làm, dùng LaTeX cho công thức
- Giữ nguyên định dạng câu hỏi gốc, chỉ chuẩn hóa công thức sang LaTeX
- Nếu là ảnh, hãy OCR cẩn thận từng ký tự, đặc biệt với công thức hóa học`;

    // Build request content for Google Gemini API
    const contents: any[] = [];

    if (isImageInput) {
      // Image input - use Vision capability
      contents.push({
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nHãy OCR và phân tích đề thi trong ảnh sau. Chú ý nhận diện chính xác các công thức hóa học và chuyển sang định dạng LaTeX chuẩn:`,
          },
          {
            inline_data: {
              mime_type: mimeType || "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      });
    } else {
      // Text input
      contents.push({
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nPhân tích đề thi sau:\n\n${text}` }],
      });
    }

    // Call Google Gemini 2.5 Flash API directly
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

    console.log("Calling Google Gemini 2.5 Flash API...");

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Đã vượt quá giới hạn request của Google Gemini API, vui lòng thử lại sau." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "API Key không hợp lệ hoặc đã hết hạn." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiResponse = await response.json();
    console.log("Gemini API response received");

    // Extract content from Gemini response format
    const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("AI response content length:", content.length);

    // Extract JSON from response
    let questions = [];
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        questions = parsed.questions || [];

        // Post-process to ensure LaTeX formatting is correct
        questions = questions.map((q: any) => ({
          ...q,
          question: normalizeLatex(q.question),
          options: (q.options || []).map((opt: string) => normalizeLatex(opt)),
          explanation: q.explanation ? normalizeLatex(q.explanation) : null,
        }));
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return new Response(JSON.stringify({ error: "Không thể phân tích kết quả từ AI", raw: content }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Parsed ${questions.length} questions successfully`);

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in parse-quiz-text:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helper function to normalize LaTeX formatting
function normalizeLatex(text: string): string {
  if (!text) return text;

  let result = text;

  // Fix common LaTeX issues
  // Ensure \ce{} is properly formatted
  result = result.replace(/\\ce\s*\{/g, "\\ce{");

  // Fix escaped backslashes that might come from JSON
  result = result.replace(/\\\\ce\{/g, "\\ce{");
  result = result.replace(/\\\\frac\{/g, "\\frac{");
  result = result.replace(/\\\\text\{/g, "\\text{");

  return result;
}
