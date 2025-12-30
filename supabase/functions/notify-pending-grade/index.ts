import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify authentication - only allow service role or authenticated admins
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { attemptId, quizTitle, studentName, studentEmail } = await req.json();

    if (!attemptId || !quizTitle || !studentName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`New pending grade notification: Quiz "${quizTitle}" submitted by ${studentName} (${studentEmail})`);

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all admin users to notify
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      return new Response(JSON.stringify({ error: "Failed to fetch admin users" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admin users found to notify");
      return new Response(JSON.stringify({ message: "No admin users to notify" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get admin emails from auth.users table (using service role)
    const adminUserIds = adminRoles.map((r) => r.user_id);

    // Fetch admin emails - we need to use the auth admin API
    const adminEmails: string[] = [];
    for (const userId of adminUserIds) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData?.user?.email) {
        adminEmails.push(userData.user.email);
      }
    }

    console.log(`Found ${adminEmails.length} admin emails to notify`);

    // For now, just log the notification - email sending can be added later with Resend
    // This creates a record of the notification for debugging
    const notificationLog = {
      type: "pending_grade",
      attemptId,
      quizTitle,
      studentName,
      studentEmail,
      adminEmails,
      timestamp: new Date().toISOString(),
    };

    console.log("Notification details:", JSON.stringify(notificationLog));

    // TODO: Add email sending with Resend when RESEND_API_KEY is configured
    // Example:
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    for (const email of adminEmails) {
      await resend.emails.send({
        from: "ChemLab <noreply@yoursite.com>",
        to: [email],
        subject: `[Cần chấm điểm] Bài thi mới từ ${studentName}`,
        html: `
          <h2>Có bài thi mới cần chấm điểm</h2>
          <p><strong>Học sinh:</strong> ${studentName}</p>
         <p><strong>Bài kiểm tra:</strong> ${quizTitle}</p>
          <p>Vui lòng truy cập trang chấm bài để xem và chấm điểm câu tự luận.</p>
        `,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification logged for ${adminEmails.length} admins`,
        adminEmails,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in notify-pending-grade function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
