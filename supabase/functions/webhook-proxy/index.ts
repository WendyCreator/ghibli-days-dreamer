import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_WEBHOOK = "https://n8n.zaicondigital.com/webhook/ghibliautomation";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "";

    console.log("Proxying to n8n, content-type:", contentType, "body size:", body.byteLength);

    // Use a ReadableStream to send keepalive pings while waiting for n8n
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Start the n8n request
    const n8nPromise = fetch(TARGET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
    });

    // Send keepalive pings every 15 seconds to prevent connection timeout
    const keepaliveInterval = setInterval(async () => {
      if (!resolved) {
        try {
          await writer.write(encoder.encode(" "));
          console.log("Keepalive ping sent");
        } catch {
          clearInterval(keepaliveInterval);
        }
      }
    }, 10000);

    // Wait for n8n response
    try {
      const response = await n8nPromise;
      resolved = true;
      clearInterval(keepaliveInterval);

      const data = await response.text();
      console.log("n8n response status:", response.status, "body length:", data.length);

      let result: string;

      if (!response.ok) {
        console.error(`n8n returned ${response.status}: ${data}`);
        result = JSON.stringify({
          error: `n8n webhook error (${response.status})`,
          details: data,
        });
      } else if (!data || data.trim().length === 0) {
        console.error("n8n returned empty response");
        result = JSON.stringify({
          error: "n8n returned an empty response. The workflow may have timed out or failed silently.",
        });
      } else {
        // Ensure response is valid JSON
        try {
          JSON.parse(data);
          result = data;
        } catch {
          console.log("Wrapping non-JSON response as JSON object");
          result = JSON.stringify({ output: data });
        }
      }

      // Write the actual response data and close
      await writer.write(encoder.encode(result));
      await writer.close();
    } catch (fetchError) {
      resolved = true;
      clearInterval(keepaliveInterval);
      console.error("n8n fetch error:", fetchError);
      const errResult = JSON.stringify({ error: fetchError.message });
      await writer.write(encoder.encode(errResult));
      await writer.close();
    }

    return new Response(readable, {
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
