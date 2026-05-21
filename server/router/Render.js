const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

const SITE_URL = process.env.SITE_URL || 'https://aitechacademy.online';
const API_BASE = (process.env.API_URL || 'https://api.aitechacademy.online').replace(/\/$/, '');

// Regex of known search engine and social media bots
const BOT_REGEX = /googlebot|google-inspectiontool|bingbot|yandexbot|baiduspider|duckduckbot|slurp|facebot|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|applebot|discordbot|slackbot|prerender|ahrefsbot|semrushbot|mj12bot|dotbot/i;

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function escHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveImage(img) {
  if (!img) return `${SITE_URL}/image.png`;
  if (img.startsWith('data:')) return `${SITE_URL}/image.png`; // never expose base64
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/uploads/') || img.startsWith('/blog-image/')) return `${API_BASE}${img}`;
  if (img.startsWith('uploads/') || img.startsWith('blog-image/')) return `${API_BASE}/${img}`;
  return `${SITE_URL}/image.png`;
}

// GET /render/blog/:slug
// Called by the Netlify edge function for bot/crawler requests.
// Returns a fully-rendered static HTML page with all SEO meta tags.
router.get('/render/blog/:slug', async (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const isBotHeader = req.headers['x-bot-render'] === 'true';
  const isBot = isBotHeader || BOT_REGEX.test(ua);

  // Protect endpoint: non-bot direct requests just get redirected
  if (!isBot) {
    return res.redirect(302, `${SITE_URL}/blog/${req.params.slug}`);
  }

  try {
    const blog = await Blog.findOne(
      { slug: req.params.slug },
      { title: 1, description: 1, image: 1, publishDate: 1, category: 1, tags: 1, authorName: 1, slug: 1, updatedAt: 1, readtime: 1 }
    ).lean();

    if (!blog) {
      return res.status(404).send(`<!DOCTYPE html><html><head><title>Not Found | AITECHACADEMY</title><meta name="robots" content="noindex"/></head><body><p>Article not found.</p></body></html>`);
    }

    const pageTitle  = `${blog.title} | AITECHACADEMY`;
    const plainDesc  = stripHtml(blog.description).slice(0, 155);
    const imgUrl     = resolveImage(blog.image);
    const canonical  = `${SITE_URL}/blog/${escHtml(blog.slug)}`;
    const keywords   = [blog.category, ...(blog.tags || [])].filter(Boolean).join(', ');
    const datePubl   = blog.publishDate || '';
    const dateMod    = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : datePubl;
    const tagMetas   = (blog.tags || []).map(t => `  <meta property="article:tag" content="${escHtml(t)}"/>`).join('\n');

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'mainEntityOfPage': { '@type': 'WebPage', '@id': canonical },
      'headline': blog.title,
      'description': plainDesc,
      'image': imgUrl,
      'author': { '@type': 'Person', 'name': blog.authorName || 'AITECHACADEMY' },
      'publisher': {
        '@type': 'Organization',
        'name': 'AITECHACADEMY',
        'logo': { '@type': 'ImageObject', 'url': `${SITE_URL}/image.png` }
      },
      'datePublished': datePubl,
      'dateModified': dateMod,
      'keywords': keywords,
      'articleSection': blog.category,
      'url': canonical,
      'timeRequired': blog.readtime || ''
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escHtml(pageTitle)}</title>
  <meta name="description" content="${escHtml(plainDesc)}"/>
  <meta name="keywords" content="${escHtml(keywords)}"/>
  <meta name="author" content="${escHtml(blog.authorName || 'AITECHACADEMY')}"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <link rel="canonical" href="${canonical}"/>

  <!-- Open Graph -->
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${escHtml(pageTitle)}"/>
  <meta property="og:description" content="${escHtml(plainDesc)}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:image" content="${escHtml(imgUrl)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:site_name" content="AITECHACADEMY"/>
  <meta property="article:published_time" content="${escHtml(datePubl)}"/>
  <meta property="article:modified_time" content="${escHtml(dateMod)}"/>
  <meta property="article:section" content="${escHtml(blog.category || '')}"/>
${tagMetas}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${escHtml(pageTitle)}"/>
  <meta name="twitter:description" content="${escHtml(plainDesc)}"/>
  <meta name="twitter:image" content="${escHtml(imgUrl)}"/>

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <a href="${SITE_URL}">AITECHACADEMY</a>
  </header>
  <main>
    <article>
      <h1>${escHtml(blog.title)}</h1>
      ${blog.category ? `<p><strong>Category:</strong> <a href="${SITE_URL}/tag/${escHtml(blog.category)}">${escHtml(blog.category)}</a></p>` : ''}
      ${datePubl ? `<time datetime="${escHtml(datePubl)}">${escHtml(datePubl)}</time>` : ''}
      <p>${escHtml(plainDesc)}</p>
      ${(blog.tags || []).length ? `<p><strong>Tags:</strong> ${blog.tags.map(t => `<a href="${SITE_URL}/tag/${escHtml(t)}">${escHtml(t)}</a>`).join(', ')}</p>` : ''}
      <p><a href="${canonical}">Read the full article on AITECHACADEMY &rarr;</a></p>
    </article>
  </main>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache rendered pages for 1h
    res.send(html);

  } catch (err) {
    console.error('[Render] Error rendering blog slug:', req.params.slug, err.message);
    res.redirect(302, `${SITE_URL}/blog/${req.params.slug}`);
  }
});

module.exports = router;
