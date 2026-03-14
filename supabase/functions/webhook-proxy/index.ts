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

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Start the n8n request
    const n8nPromise = fetch(TARGET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body,
    });

    // Populate the stream asynchronously (don't await here — return response immediately)
    (async () => {
      let keepaliveInterval: number | undefined;
      try {
        // Send keepalive pings every 8 seconds to prevent connection timeout
        keepaliveInterval = setInterval(async () => {
          try {
            await writer.write(encoder.encode(" "));
            console.log("Keepalive ping sent");
          } catch {
            // writer closed, stop pinging
            clearInterval(keepaliveInterval);
          }
        }, 8000);

        // Send first ping immediately
        await writer.write(encoder.encode(" "));

        const response = await n8nPromise;
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

        await writer.write(encoder.encode(result));
        await writer.close();
      } catch (fetchError) {
        if (keepaliveInterval) clearInterval(keepaliveInterval);
        console.error("n8n fetch error:", fetchError);
        try {
          const errResult = JSON.stringify({ error: fetchError.message });
          await writer.write(encoder.encode(errResult));
          await writer.close();
        } catch {
          // writer already closed
        }
      }
    })();

    // Return the streaming response IMMEDIATELY so client stays connected
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
