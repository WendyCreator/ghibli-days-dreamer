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
    // Forward the request body as-is to the n8n webhook
    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";

    const response = await fetch(TARGET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
