import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get request body
        const { email } = await req.json();

        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Check if any admin exists
        const { data: existingAdmins } = await supabase
            .from('user_roles')
            .select('*')
            .eq('role', 'admin');

        // Only allow if no admins exist yet (first admin creation)
        if (existingAdmins && existingAdmins.length > 0) {
            return new Response(
                JSON.stringify({
                    error: 'Admin already exists. Use promote_to_admin function instead.',
                    adminCount: existingAdmins.length
                }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get user by email
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

        if (userError) {
            throw userError;
        }

        const user = userData.users.find(u => u.email === email);

        if (!user) {
            return new Response(
                JSON.stringify({ error: `User with email ${email} not found. Please sign up first.` }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Insert admin role
        const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: user.id, role: 'admin' });

        if (insertError) {
            throw insertError;
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Successfully created first admin: ${email}`,
                userId: user.id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
