require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const MONGODB_URI = process.env.MONGODB_URI;

const date = new Date();
const publishDate = `${date.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]} ${date.getFullYear()}`;

const blogs = [
  {
    title: "Google AI in 2026: Complete Practical Guide for Businesses and Creators",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    description: `<h2>Introduction</h2><p>Google AI has evolved from isolated tools into a complete ecosystem for search, ads, content, and operations. For modern publishers, the challenge is using AI without reducing trust. In this guide, we cover practical implementation, risk controls, editorial standards, and SEO structure for durable rankings.</p><p>When building content at scale, pair AI acceleration with human review. Use AI for research mapping, first-draft structure, semantic clustering, and answer extraction, then apply editorial judgment to add examples, local context, and authority. This protects quality while increasing velocity.</p><h2>SEO Implementation</h2><p>Use clear heading hierarchy, FAQ blocks, internal links, and schema where appropriate. Align each article with one intent and related entities. Helpful references: <a href='https://developers.google.com/search/docs/fundamentals/creating-helpful-content' target='_blank' rel='noreferrer'>Google Helpful Content</a>, <a href='https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' target='_blank' rel='noreferrer'>Structured Data Guide</a>.</p><h2>Editorial Workflow</h2><p>Step 1: intent analysis. Step 2: topic cluster plan. Step 3: AI-assisted draft. Step 4: expert review and fact-check. Step 5: publish with metadata and schema. Step 6: optimize based on Search Console CTR and engagement.</p><h2>Final Takeaway</h2><p>AI gives speed, but human clarity gives rankings. Build systems that combine both.</p>`,
    category: "Technology",
    readtime: "9 min read",
    authorName: "shivam_kushwaha",
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    publishDate
  },
  {
    title: "Best AI Tools for Content, SEO, and Growth in 2026",
    image: "https://images.unsplash.com/photo-1675271591211-6f0f7fdb3d8f?w=1200",
    description: `<h2>Overview</h2><p>The best AI stack is not one tool. It is a workflow. You need research, writing, optimization, QA, and analytics layers connected into one process. This article explains how to build that stack responsibly.</p><h2>Tool Stack</h2><p>For market and keyword research, use trend and SERP tools. For writing, use AI drafting assistants with strict editorial rules. For SEO QA, use on-page analyzers and schema checkers. For content governance, keep a review checklist and revision log.</p><p>Use external docs while evaluating vendors: <a href='https://search.google.com/search-console/about' target='_blank' rel='noreferrer'>Google Search Console</a>, <a href='https://ahrefs.com/blog/seo-basics/' target='_blank' rel='noreferrer'>SEO Basics</a>.</p><h2>Selection Framework</h2><p>Score each tool on accuracy, speed, integration, cost, and team adoption. Run a 30-day pilot, measure output quality and organic growth impact, then scale.</p><h2>Conclusion</h2><p>Choose tools that improve consistency and decision quality, not only content volume.</p>`,
    category: "Technology",
    readtime: "8 min read",
    authorName: "shivam_kushwaha",
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    publishDate
  },
  {
    title: "AI SEO Strategy: How to Rank with Human-First Content",
    image: "https://images.unsplash.com/photo-1551281044-8b4a8fc70478?w=1200",
    description: `<h2>Core Principle</h2><p>AI SEO works when content is created for users first and search engines second. Google systems reward content that solves problems clearly and credibly.</p><h2>Framework</h2><p>Start with search intent, build outline depth, include examples, use semantic headings, and answer related sub-questions directly. Add FAQ and structured data where relevant.</p><h2>Common Mistakes</h2><p>Do not publish unedited AI drafts. Do not repeat keywords unnaturally. Do not ignore topical authority and internal linking.</p><h2>Execution</h2><p>Create pillar pages, support them with cluster articles, and continuously refresh based on user behavior data.</p>`,
    category: "Business",
    readtime: "10 min read",
    authorName: "shivam_kushwaha",
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    publishDate
  },
  {
    title: "Google Search + AI Overviews: What Publishers Should Do Now",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1200",
    description: `<h2>Search Is Changing</h2><p>AI Overviews are changing how users discover information. Publishers need stronger brand trust, clearer differentiation, and better experience signals to stay competitive.</p><h2>What Still Works</h2><p>Original insights, first-hand examples, updated statistics, and clear article structure still perform. Helpful pages continue to win long-term traffic.</p><h2>What to Improve</h2><p>Improve title clarity, create strong intros, optimize internal links, and align each page with one primary intent.</p><h2>Future-Proofing</h2><p>Treat every article as a product: improve speed, clarity, and conversion journey after publish.</p>`,
    category: "Technology",
    readtime: "7 min read",
    authorName: "shivam_kushwaha",
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    publishDate
  },
  {
    title: "AI for Small Businesses: Affordable Tools That Increase Revenue",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    description: `<h2>Why Small Businesses Need AI</h2><p>Small teams can use AI to compete with larger brands by improving speed in marketing, support, and analysis. The right setup reduces operational cost and increases output quality.</p><h2>High-ROI Use Cases</h2><p>Use AI chat systems for support drafts, marketing assistants for campaign copy, and analytics models for customer segmentation.</p><h2>SEO and Sales</h2><p>Combine AI-generated first drafts with human proofing to publish trustworthy content that attracts and converts visitors.</p><h2>Implementation Checklist</h2><p>Set goals, assign review ownership, define quality controls, and monitor ROI monthly.</p>`,
    category: "Business",
    readtime: "8 min read",
    authorName: "shivam_kushwaha",
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    publishDate
  }
];

async function run() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env");
  }
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  for (const blog of blogs) {
    await Blog.findOneAndUpdate({ title: blog.title }, { $set: blog }, { upsert: true, new: true });
    console.log(`Upserted: ${blog.title}`);
  }

  await mongoose.disconnect();
  console.log("AI blog seeding complete.");
}

run().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
