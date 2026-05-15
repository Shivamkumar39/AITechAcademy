const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({}, { slug: 1, updatedAt: 1 }).lean();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aitechacademy.online/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aitechacademy.online/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://aitechacademy.online/contact-us</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    blogs.forEach(blog => {
      const date = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>https://aitechacademy.online/blog/${blog.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
