/**
 * Netlify Edge Function: bot-renderer
 *
 * Intercepts requests to /blog/* and checks the User-Agent.
 * - If request is from a search engine / social media bot  → proxies to
 *   the Express backend /render/blog/:slug which returns a fully-rendered
 *   HTML page with real title, description, and structured data.
 * - If request is from a real user → passes through normally so the React
 *   SPA is served (no change to user experience).
 */

const BOT_REGEX =
  /googlebot|google-inspectiontool|bingbot|yandexbot|baiduspider|duckduckbot|slurp|facebot|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|applebot|discordbot|slackbot|prerender|ahrefsbot|semrushbot/i;

export default async (request, context) => {
  const ua = request.headers.get("user-agent") || "";

  // Not a bot — let Netlify serve the normal React SPA
  if (!BOT_REGEX.test(ua)) {
    return context.next();
  }

  const url = new URL(request.url);

  // Extract the slug from /blog/<slug>
  const slug = url.pathname.replace(/^\/blog\/?/, "").split("/")[0];
  if (!slug) return context.next();

  // Backend render endpoint — reads from REACT_APP_API_URL env var in Netlify
  const apiBase =
    Deno.env.get("REACT_APP_API_URL") || "https://api.aitechacademy.online";
  const renderUrl = `${apiBase.replace(/\/$/, "")}/render/blog/${slug}`;

  try {
    const response = await fetch(renderUrl, {
      headers: {
        "x-bot-render": "true",
        "user-agent": ua, // forward original UA so backend can double-check
      },
      // 5-second timeout so slow DB queries don't block the edge
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return context.next();

    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-rendered-by": "edge-bot-renderer",
        // cache rendered page in CDN for 1 hour, revalidate after
        "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (_err) {
    // On any error, fall back to the normal React SPA
    return context.next();
  }
};

export const config = {
  path: "/blog/*",
};
