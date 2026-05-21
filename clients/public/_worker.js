/**
 * Cloudflare Pages Worker — _worker.js
 *
 * Placed in clients/public/ so it gets copied into the build output.
 * Cloudflare Pages automatically picks it up and uses it to handle all requests.
 *
 * What it does:
 *  1. Detects search engine / social media bots on /blog/* routes
 *  2. Bots → proxies to Express backend /render/blog/:slug (returns real HTML with correct title)
 *  3. Real users → serves the normal React SPA (index.html) for all client-side routes
 *  4. Static assets (JS, CSS, images) → served directly from Cloudflare edge
 */

const BOT_REGEX =
  /googlebot|google-inspectiontool|bingbot|yandexbot|baiduspider|duckduckbot|slurp|facebot|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|applebot|discordbot|slackbot|prerender|ahrefsbot|semrushbot/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ua  = request.headers.get("User-Agent") || "";

    // ── 1. Bot detection: intercept /blog/<slug> for crawlers ──────────────
    if (url.pathname.match(/^\/blog\/[^/]+\/?$/) && BOT_REGEX.test(ua)) {
      const slug = url.pathname.replace(/^\/blog\//, "").replace(/\/$/, "");

      if (slug) {
        // REACT_APP_API_URL must be set in Cloudflare Pages → Settings → Environment variables
        const apiBase = (env.REACT_APP_API_URL || "https://api.aitechacademy.online").replace(/\/$/, "");

        try {
          const renderResp = await fetch(`${apiBase}/render/blog/${slug}`, {
            headers: {
              "x-bot-render": "true",
              "user-agent": ua,
            },
            signal: AbortSignal.timeout(5000),
          });

          if (renderResp.ok) {
            const html = await renderResp.text();
            return new Response(html, {
              status: 200,
              headers: {
                "content-type": "text/html; charset=utf-8",
                "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
                "x-rendered-by": "cf-bot-worker",
              },
            });
          }
        } catch (_err) {
          // Timeout or network error — fall through and serve SPA normally
        }
      }
    }

    // ── 2. Static assets: JS, CSS, images, fonts etc. ─────────────────────
    // If the path has a file extension, serve directly from Cloudflare edge
    if (/\.\w{2,6}$/.test(url.pathname)) {
      const assetResp = await env.ASSETS.fetch(request).catch(() => null);
      if (assetResp && assetResp.ok) return assetResp;
      return new Response("Not Found", { status: 404 });
    }

    // ── 3. SPA catch-all: serve index.html for all React Router routes ─────
    const indexResp = await env.ASSETS.fetch(
      new Request(`${url.origin}/index.html`, request)
    );
    return indexResp;
  },
};
