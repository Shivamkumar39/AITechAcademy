const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Users = require('../models/User');

const SITE_URL = process.env.SITE_URL || 'https://aitechacademy.online';
const API_BASE  = (process.env.API_URL || 'https://api.aitechacademy.online').replace(/\/$/, '');

function resolveImageUrl(img) {
  if (!img || img.startsWith('data:') || img.length > 2000) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/uploads/') || img.startsWith('/blog-image/')) return `${API_BASE}${img}`;
  if (img.startsWith('uploads/') || img.startsWith('blog-image/')) return `${API_BASE}/${img}`;
  return null;
}

function xmlEsc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [blogs, users] = await Promise.all([
      Blog.find({}, { slug: 1, title: 1, image: 1, updatedAt: 1, category: 1, tags: 1, authorid: 1, authorName: 1 }).lean(),
      Users.find({}, { _id: 1 }).lean()
    ]);

    // Static pages
    const staticPages = [
      { loc: `${SITE_URL}/`,                     changefreq: 'daily',   priority: '1.0' },
      { loc: `${SITE_URL}/blog`,                  changefreq: 'daily',   priority: '0.9' },
      { loc: `${SITE_URL}/categories`,            changefreq: 'weekly',  priority: '0.8' },
      { loc: `${SITE_URL}/study-material`,        changefreq: 'weekly',  priority: '0.8' },
      { loc: `${SITE_URL}/about`,                 changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/contact-us`,            changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/privacy-policy`,        changefreq: 'monthly', priority: '0.6' },
      { loc: `${SITE_URL}/terms-and-conditions`,  changefreq: 'monthly', priority: '0.6' },
      { loc: `${SITE_URL}/disclaimer`,            changefreq: 'monthly', priority: '0.6' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    // Blog posts — full entry with image sitemap data
    const categories = new Set();
    const tags = new Set();
    const today = new Date().toISOString().split('T')[0];

    for (const blog of blogs) {
      if (!blog.slug) continue;
      if (blog.category) categories.add(blog.category);
      if (Array.isArray(blog.tags)) blog.tags.forEach(t => t && tags.add(t));

      const lastmod = blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split('T')[0]
        : today;

      const imgUrl = resolveImageUrl(blog.image);

      xml += `  <url>
    <loc>${SITE_URL}/blog/${xmlEsc(blog.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

      if (imgUrl) {
        xml += `
    <image:image>
      <image:loc>${xmlEsc(imgUrl)}</image:loc>
      <image:title>${xmlEsc(blog.title || '')}</image:title>
      <image:caption>${xmlEsc(blog.title || '')}</image:caption>
    </image:image>`;
      }

      xml += `\n  </url>\n`;
    }

    // Category / tag archive pages
    const seenTagPaths = new Set();
    for (const cat of categories) {
      const encoded = encodeURIComponent(cat);
      if (seenTagPaths.has(encoded)) continue;
      seenTagPaths.add(encoded);
      xml += `  <url>
    <loc>${SITE_URL}/tag/${encoded}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    }
    for (const tag of tags) {
      const encoded = encodeURIComponent(tag);
      if (seenTagPaths.has(encoded)) continue;
      seenTagPaths.add(encoded);
      xml += `  <url>
    <loc>${SITE_URL}/tag/${encoded}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }

    // Author profile pages
    for (const user of users) {
      xml += `  <url>
    <loc>${SITE_URL}/profile/${user._id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
