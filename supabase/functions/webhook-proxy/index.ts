import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_WEBHOOK = "https://n8n.zaicondigital.com/webhook/ghibliautomation";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";

    console.log("Proxying to n8n, content-type:", contentType, "body size:", body.byteLength);

    const response = await fetch(TARGET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
    });

    const data = await response.text();
    console.log("n8n response status:", response.status, "body length:", data.length);

    if (!response.ok) {
      console.error(`n8n returned ${response.status}: ${data}`);
      return new Response(JSON.stringify({ 
        error: `n8n webhook error (${response.status})`, 
        details: data 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data || data.trim().length === 0) {
      console.error("n8n returned empty response");
      return new Response(JSON.stringify({ 
        error: "n8n returned an empty response. The workflow may have timed out or failed silently." 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure the response is valid JSON for the Supabase client
    try {
      JSON.parse(data);
    } catch {
      // Wrap non-JSON text responses as JSON
      console.log("Wrapping non-JSON response as JSON object");
      return new Response(JSON.stringify({ output: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(data, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
