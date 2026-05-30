const mongoose = require("mongoose");
const Blog = require("../models/Blog.js");
const SiteStats = require("../models/SiteStats.js");
const SiteSettings = require("../models/SiteSettings.js");
const Users = require("../models/User.js");
const slugify = require("slugify");

const BASE_VISITS = 1010;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MAX_INLINE_IMAGE_LENGTH = 120000;
const LIST_CACHE_TTL_MS = 30000;
const BLOG_CACHE_TTL_MS = 30000;
const cache = {
  blogs: { at: 0, data: null },
  blogBySlug: new Map(),
  blogImage: new Map(),
};
const BLOG_IMAGE_CACHE_TTL_MS = 5 * 60 * 1000;

const normalizeStoredImage = (image) => {
  if (typeof image !== "string") return "";
  const src = image.trim().replace(/\\/g, "/");
  if (!src) return "";

  if (src.startsWith("data:")) return src;
  if (/^[A-Za-z0-9+/=]+$/.test(src.slice(0, 200)) && src.length > 5000) {
    return `data:image/jpeg;base64,${src}`;
  }
  if (src.startsWith("/uploads/") || src.startsWith("/blog-image/")) return src;
  if (src.startsWith("uploads/")) return `/${src}`;
  if (src.startsWith("blog-image/")) return `/${src}`;

  try {
    const parsed = new URL(src);
    if (parsed.pathname.startsWith("/uploads/") || parsed.pathname.startsWith("/blog-image/")) {
      return parsed.pathname;
    }
  } catch (_) {
    // Keep as-is if not a valid URL
  }

  return src;
};

const getImageUrl = (req, blogId, image) => {
  const normalized = normalizeStoredImage(image);
  if (!normalized) return "";
  if (normalized.startsWith("/uploads/")) return normalized;
  if (normalized.startsWith("data:")) {
    return `/blog-image/${blogId}`;
  }
  return normalized;
};

const withAbsoluteImage = (req, blog) => {
  if (!blog) return blog;
  const data = { ...blog };
  data.image = getImageUrl(req, data._id, data.image);
  if (typeof data.authorImage === "string") {
    data.authorImage = normalizeStoredImage(data.authorImage);
  }
  return data;
};

const toListBlog = (req, blog) => {
  const data = withAbsoluteImage(req, blog);
  const trimmed = {
    _id: data._id,
    title: data.title,
    slug: data.slug,
    authorid: data.authorid,
    authorImage: data.authorImage,
    authorName: data.authorName,
    image: data.image,
    description: String(data.description || "").slice(0, 300),
    category: data.category,
    tags: data.tags,
    readtime: data.readtime,
    publishDate: data.publishDate,
    views: data.views || 0,
    likes: Array.isArray(data.likes) ? data.likes : [],
    comments: Array.isArray(data.comments) ? data.comments : [],
  };

  // Large inline base64 images make list payload huge and cause frontend timeout.
  if (typeof blog?.image === "string" && blog.image.startsWith("data:") && blog.image.length > MAX_INLINE_IMAGE_LENGTH) {
    trimmed.image = `/blog-image/${blog._id}`;
  }

  return trimmed;
};

exports.addBlog = async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Only admin can add articles" });
  }
  const d = new Date();
  const date = d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();

  const { title, authorid, authorName, authorImage, image, description, category, readtime, tags, pdfLinks, slug: customSlug, metaTitle, metaDescription } = req.body;

  let slug = customSlug ? slugify(customSlug, { lower: true, strict: true }) : slugify(title || '', { lower: true, strict: true });
  if (!slug) slug = Date.now().toString();

  let finalSlug = slug;
  let slugCounter = 1;
  while (await Blog.findOne({ slug: finalSlug })) {
    finalSlug = `${slug}-${slugCounter}`;
    slugCounter++;
  }

  const data = {
    title: String(title || '').trim(),
    slug: finalSlug,
    authorid: authorid || req.userId || null,
    authorImage: normalizeStoredImage(authorImage) || "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    authorName: authorName || (req.rootUser ? req.rootUser.name : "Admin"),
    image: normalizeStoredImage(image),
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map(tag => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(pdfLinks) ? pdfLinks : [],
    publishDate: date,
    metaTitle: String(metaTitle || '').trim(),
    metaDescription: String(metaDescription || '').trim()
  };

  try {
    // Use strict: false to ensure metaTitle/metaDescription always save
    const blog = new Blog(data);
    blog.$__.strictMode = false;
    await blog.save();
    res.json({ message: "blog added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save blog" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}, { image: 0 }).sort({ _id: -1 }).lean();
    const updatedBlogs = blogs.map(blog => ({
      ...blog,
      image: `/blog-image/${blog._id}`
    }));
    res.json(updatedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).lean();
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Increment views in background to avoid blocking the response
    Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec().catch(err => console.error("View count error:", err));

    res.json({ message: withAbsoluteImage(req, blog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const d = new Date();
  const date = monthNames[d.getMonth()] + " " + d.getDate();

  const { title, authorid, image, description, category, readtime, authorImage, tags, pdfLinks, slug, metaTitle, metaDescription } = req.body;

  const data = {
    title: String(title || '').trim(),
    authorid: authorid,
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map(tag => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(pdfLinks) ? pdfLinks : [],
    authorName: "shivam_kushwaha",
    authorImage: normalizeStoredImage(authorImage),
    publishDate: "Edited " + date,
    metaTitle: String(metaTitle || '').trim(),
    metaDescription: String(metaDescription || '').trim()
  };

  if (image === "" || (image && !image.startsWith('/blog-image/'))) {
    const normalized = normalizeStoredImage(image);
    // NEVER save the internal api route as the image itself, this corrupts the database
    if (!(normalized && normalized.startsWith('/blog-image/'))) {
      data.image = normalized;
    }
  }

  if (slug) {
    data.slug = slugify(slug, { lower: true, strict: true });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.authorid == req.userId || req.rootUser.role === "admin") {
      // Use strict: false to ensure metaTitle/metaDescription are always saved
      // even if server was not restarted after schema update
      await Blog.findByIdAndUpdate(
        id,
        { $set: data },
        { strict: false }
      );
      res.json({ success: "Updated" });
    } else {
      res.status(403).json({ message: "Cannot update others blog" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.authorid == req.userId || req.rootUser.role === "admin") {
      await SiteStats.findOneAndUpdate(
        { key: "global" },
        { $inc: { totalVisits: blog.views || 0 } },
        { upsert: true }
      );
      await Blog.findByIdAndDelete(id);
      res.json({ success: "Blog deleted" });
    } else {
      res.status(403).json({ error: "Not authorized to delete this blog" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

exports.getAdminBlogs = async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const blogs = await Blog.find({}, { image: 0 }).sort({ _id: -1 }).lean();
    const updatedBlogs = blogs.map(blog => ({
      ...blog,
      image: `/blog-image/${blog._id}`
    }));
    res.json({ blogs: updatedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admin blogs" });
  }
};

exports.getAdminStats = async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await Users.countDocuments();
    const totalViewsRes = await Blog.aggregate([
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);
    const siteStats = await SiteStats.findOne({ key: "global" });
    const blogViews = totalViewsRes[0]?.views || 0;
    const visits = siteStats?.totalVisits || BASE_VISITS;

    res.json({
      totalBlogs,
      totalUsers,
      totalViews: blogViews + visits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

exports.getSiteStats = async (req, res) => {
  try {
    // Optimization: Use a single aggregate to get both total views and site visits if possible, 
    // or just fetch them efficiently. Summing all blog views can be slow, so we cache or use simple queries.
    const [totalViewsRes, site] = await Promise.all([
      Blog.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]),
      SiteStats.findOne({ key: "global" })
    ]);

    const blogViews = totalViewsRes[0]?.views || 0;
    const visits = site?.totalVisits || 0;
    const totalVisits = visits + BASE_VISITS;

    res.json({ totalViews: blogViews + totalVisits, totalVisits: totalVisits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch site stats" });
  }
};

exports.getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: "global" });
    if (!settings) {
      settings = await SiteSettings.create({ key: "global" });
    }
    res.json({ settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
};

exports.updateSiteSettings = async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const payload = {
      websiteName: String(req.body.websiteName || "").trim(),
      websiteDomain: String(req.body.websiteDomain || "").trim(),
      facebook: String(req.body.facebook || "").trim(),
      instagram: String(req.body.instagram || "").trim(),
      twitter: String(req.body.twitter || "").trim(),
      linkedin: String(req.body.linkedin || "").trim(),
      youtube: String(req.body.youtube || "").trim(),
      github: String(req.body.github || "").trim(),
      adsenseEnabled: Boolean(req.body.adsenseEnabled),
      adsenseTestMode: Boolean(req.body.adsenseTestMode),
      adsensePublisherId: String(req.body.adsensePublisherId || "").trim(),
      adsenseBannerSlot: String(req.body.adsenseBannerSlot || "").trim(),
      adsenseSidebarSlot: String(req.body.adsenseSidebarSlot || "").trim(),
      adsenseInfeedSlot: String(req.body.adsenseInfeedSlot || "").trim(),
      adsenseInArticleSlot: String(req.body.adsenseInArticleSlot || "").trim(),
      adsenseFooterSlot: String(req.body.adsenseFooterSlot || "").trim(),
      resumePdf: String(req.body.resumePdf || "").trim(),
    };
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      { $set: payload },
      { upsert: true, new: true }
    );
    res.json({ settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save site settings" });
  }
};

exports.trackSiteVisit = async (req, res) => {
  try {
    const site = await SiteStats.findOneAndUpdate(
      { key: "global" },
      { $inc: { totalVisits: 1 } },
      { upsert: true, new: true }
    );
    res.json({ totalVisits: site.totalVisits + BASE_VISITS });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to track site visit" });
  }
};

exports.getBlogsByAuthorId = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ authorid: id }).sort({ _id: -1 }).lean();
    res.json({ Blogs: blogs.map((blog) => toListBlog(req, blog)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs by author" });
  }
};

exports.getCategoryCount = async (req, res) => {
  try {
    const requested = [
      "Educational", "News", "Latest AI News", "Innovation",
      "Study Material", "Technology", "Btech CSE Material"
    ];

    const counts = {};

    // We fetch counts for each requested category individually to check both category and tags fields
    await Promise.all(requested.map(async (cat) => {
      const count = await Blog.countDocuments({
        $or: [
          { category: { $regex: new RegExp(`^${cat}$`, "i") } },
          { tags: { $regex: new RegExp(`^${cat}$`, "i") } }
        ]
      });
      counts[cat] = count;
    }));

    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch category count" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const requested = [
      "Educational", "News", "Latest AI News", "Innovation",
      "Study Material", "Technology", "Btech CSE Material"
    ];
    const categories = await Blog.distinct("category");
    const tags = await Blog.distinct("tags");

    // Combine existing categories, tags, and our requested default list
    // Also limit the tags to the most recent ones.
    const recentBlogs = await Blog.find({}, { tags: 1 }).sort({ _id: -1 }).limit(30).lean();
    const recentTagsSet = new Set();
    recentBlogs.forEach(blog => {
      (blog.tags || []).forEach(tag => recentTagsSet.add(tag));
    });
    const recentTags = Array.from(recentTagsSet);

    const suggestions = Array.from(new Set([...recentTags]));

    res.json({ categories, tags, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getBlogsByTag = async (req, res) => {
  const { id } = req.params;
  try {
    // Escape string for regex to avoid ReDoS or matching errors
    const safeId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Optimization: Exclude description to speed up results
    const blogs = await Blog.find({
      $or: [
        { category: { $regex: new RegExp(`^${safeId}$`, "i") } },
        { tags: { $regex: new RegExp(`^${safeId}$`, "i") } }
      ]
    }, { description: 0 }).sort({ _id: -1 }).lean();
    res.json({ blogs: (blogs || []).map((blog) => toListBlog(req, blog)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs by tag" });
  }
};

exports.getBlogsCount = async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs count" });
  }
};

exports.searchBlogsByTitle = async (req, res) => {
  const { q } = req.query;
  try {
    const data = await Blog.find({ title: { $regex: q || "", $options: "i" } }, { description: 0 }).sort({ _id: -1 }).lean();
    res.json(data.map((blog) => toListBlog(req, blog)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};

exports.searchBlogsByCategory = async (req, res) => {
  const { q } = req.query;
  try {
    const data = await Blog.find({ category: { $regex: q || "", $options: "i" } }, { description: 0 }).sort({ _id: -1 }).lean();
    res.json(data.map((blog) => toListBlog(req, blog)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};

exports.bookmarkBlog = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.bookmarks.includes(id)) {
      await user.updateOne({ $push: { bookmarks: id } });
      res.json("Bookmarked");
    } else {
      res.json("already Bookmarked");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to bookmark" });
  }
};

exports.unbookmarkBlog = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.bookmarks.includes(id)) {
      await user.updateOne({ $pull: { bookmarks: id } });
      res.json("unbookmarked");
    } else {
      res.json("bookmark first");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unbookmark" });
  }
};

exports.likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (!blog.likes.includes(userId)) {
      await blog.updateOne({ $push: { likes: userId } });
      res.json("Liked");
    } else {
      res.json("You already liked it");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like" });
  }
};

exports.unlikeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.likes.includes(userId)) {
      await blog.updateOne({ $pull: { likes: userId } });
      res.json("unliked");
    } else {
      res.json("You never liked it ");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unlike" });
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, info } = req.body;
  if (!info || !info.toString().trim()) {
    return res.status(400).json({ error: "Comment text is required" });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const comment = {
      userId: String(userId || "anonymous"),
      info: String(info).trim(),
      blogId: String(id),
    };
    await blog.updateOne({ $push: { comments: comment } });
    res.json({ message: "Comment added", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const cached = cache.blogBySlug.get(slug);
    if (cached && (Date.now() - cached.at) < BLOG_CACHE_TTL_MS) {
      return res.json({ message: cached.data });
    }

    // Try to find by slug first
    let blog = await Blog.findOne({ slug: slug }).lean();

    // If not found, check if the slug is actually a valid MongoDB ID
    if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findById(slug).lean();
    }

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Increment views in background to avoid blocking the response
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec().catch(err => console.error("View count error:", err));

    const payload = withAbsoluteImage(req, blog);
    cache.blogBySlug.set(slug, { at: Date.now(), data: payload });
    res.json({ message: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.generateSitemap = async (req, res) => {
  try {
    const blogs = await Blog.find({}, { slug: 1, updatedAt: 1 }).sort({ createdAt: -1 });

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages with priority and change frequency
    const today = new Date().toISOString().split('T')[0];
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: 'blog', priority: '0.9', changefreq: 'daily' },
      { path: 'blogs', priority: '0.9', changefreq: 'daily' },
      { path: 'study-material', priority: '0.9', changefreq: 'weekly' },
      { path: 'categories', priority: '0.8', changefreq: 'weekly' },
      { path: 'resume', priority: '0.7', changefreq: 'monthly' },
      { path: 'about', priority: '0.7', changefreq: 'monthly' },
      { path: 'contact-us', priority: '0.6', changefreq: 'monthly' },
      { path: 'disclaimer', priority: '0.4', changefreq: 'yearly' },
      { path: 'privacy-policy', priority: '0.4', changefreq: 'yearly' },
      { path: 'terms-and-conditions', priority: '0.4', changefreq: 'yearly' },
    ];
    staticPages.forEach(function(p) {
      sitemap += '  <url>\n';
      sitemap += '    <loc>https://aitechacademy.online/' + p.path + '</loc>\n';
      sitemap += '    <lastmod>' + today + '</lastmod>\n';
      sitemap += '    <changefreq>' + p.changefreq + '</changefreq>\n';
      sitemap += '    <priority>' + p.priority + '</priority>\n';
      sitemap += '  </url>\n';
    });

    blogs.forEach(function(blog) {
      if (blog.slug) {
        var lastmod = blog.updatedAt
          ? new Date(blog.updatedAt).toISOString().split('T')[0]
          : today;
        sitemap += '  <url>\n';
        sitemap += '    <loc>https://aitechacademy.online/blog/' + blog.slug + '</loc>\n';
        sitemap += '    <lastmod>' + lastmod + '</lastmod>\n';
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
      }
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
};

exports.getBlogImage = async (req, res) => {
  try {
    const cachedImage = cache.blogImage.get(req.params.id);
    if (cachedImage && (Date.now() - cachedImage.at) < BLOG_IMAGE_CACHE_TTL_MS) {
      res.set("Content-Type", cachedImage.mimeType);
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(cachedImage.buffer);
    }

    const blog = await Blog.findById(req.params.id, { image: 1 }).lean();
    const normalizedImage = normalizeStoredImage(blog?.image);
    if (!normalizedImage) return res.status(404).json({ error: "Image not found" });
    if (typeof normalizedImage === "string" && normalizedImage.startsWith("data:")) {
      const match = normalizedImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid image format" });
      const mimeType = match[1];
      const base64Data = match[2];
      const imageBuffer = Buffer.from(base64Data, "base64");
      cache.blogImage.set(req.params.id, { at: Date.now(), mimeType, buffer: imageBuffer });
      res.set("Content-Type", mimeType);
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(imageBuffer);
    }
    if (typeof normalizedImage === "string" && (normalizedImage.startsWith("http://") || normalizedImage.startsWith("https://"))) {
      return res.redirect(normalizedImage);
    }
    if (typeof normalizedImage === "string" && normalizedImage.startsWith("/uploads/")) {
      return res.redirect(`${req.protocol}://${req.get("host")}${normalizedImage}`);
    }
    return res.status(400).json({ error: "Unsupported image source" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
};
