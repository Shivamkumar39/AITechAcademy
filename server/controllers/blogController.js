const mongoose = require("mongoose");
const Blog = require("../models/Blog.js");
const SiteStats = require("../models/SiteStats.js");
const SiteSettings = require("../models/SiteSettings.js");
const Users = require("../models/User.js");
const slugify = require("slugify");

const BASE_VISITS = 1010;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

exports.addBlog = async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Only admin can add articles" });
  }
  const d = new Date();
  const date = d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();

  const { title, authorid, image, description, category, readtime, tags, pdfLinks, slug: customSlug } = req.body;

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
    authorImage: "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
    authorName: "shivam_kushwaha",
    image: String(image || '').trim(),
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map(tag => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(pdfLinks) ? pdfLinks : [],
    publishDate: date,
  };

  try {
    const blog = new Blog(data);
    await blog.save();
    res.json({ message: "blog added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save blog" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    // 100ms Optimization: Excluding images from the main list.
    const blogs = await Blog.find({})
      .select('title slug category authorName authorImage authorid publishDate readtime')
      .sort({ _id: -1 })
      .limit(10)
      .lean();
    res.json(blogs);
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

    res.json({ message: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const d = new Date();
  const date = monthNames[d.getMonth()] + " " + d.getDate();

  const { title, authorid, image, description, category, readtime, authorImage, tags, pdfLinks, slug } = req.body;

  const data = {
    title: String(title || '').trim(),
    authorid: authorid,
    image: String(image || '').trim(),
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map(tag => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(pdfLinks) ? pdfLinks : [],
    authorName: "shivam_kushwaha",
    authorImage: authorImage,
    publishDate: "Edited " + date,
  };

  if (slug) {
    data.slug = slugify(slug, { lower: true, strict: true });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.authorid == req.userId || req.rootUser.role === "admin") {
      await Blog.findByIdAndUpdate(id, { $set: data });
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
    const blogs = await Blog.find({}).sort({ publishDate: -1 }).lean();
    res.json({ blogs });
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
    const blogs = await Blog.find({ authorid: id }).lean();
    res.json({ Blogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs by author" });
  }
};

exports.getCategoryCount = async (req, res) => {
  try {
    const results = await Blog.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const counts = {
      blockchain: 0, fashion: 0, technology: 0, business: 0,
      health: 0, fitness: 0, javascript: 0, video: 0
    };

    results.forEach(r => {
      if (r._id) {
        const cat = r._id.toLowerCase();
        // Map common categories or handle video/videos plural
        if (cat.startsWith('video')) {
          counts.video += r.count;
        } else if (counts.hasOwnProperty(cat)) {
          counts[cat] = r.count;
        }
      }
    });

    res.json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch category count" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category");
    const tags = await Blog.distinct("tags");
    const suggestions = Array.from(new Set([...(categories || []), ...(tags || [])]));
    res.json({ categories, tags, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getBlogsByTag = async (req, res) => {
  const { id } = req.params;
  try {
    // Optimization: Exclude description to speed up results
    const blogs = await Blog.find({ $or: [{ category: id }, { tags: id }] }, { description: 0 }).lean();
    res.json({ blogs: blogs || [] });
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
    const data = await Blog.find({ title: { $regex: q || "", $options: "i" } }, { description: 0 }).lean();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};

exports.searchBlogsByCategory = async (req, res) => {
  const { q } = req.query;
  try {
    const data = await Blog.find({ category: { $regex: q || "", $options: "i" } }, { description: 0 }).lean();
    res.json(data);
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
    // Try to find by slug first
    let blog = await Blog.findOne({ slug: slug }).lean();

    // If not found, check if the slug is actually a valid MongoDB ID
    if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findById(slug).lean();
    }

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Increment views in background to avoid blocking the response
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec().catch(err => console.error("View count error:", err));

    res.json({ message: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.generateSitemap = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ publishDate: -1 });

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    const staticPages = ['', 'about', 'contact-us', 'privacy-policy', 'terms-and-conditions'];
    staticPages.forEach((page) => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>https://aitechacademy.online/${page}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += '  </url>\n';
    });

    blogs.forEach((blog) => {
      if (blog.slug) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>https://aitechacademy.online/${blog.slug}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        sitemap += '  </url>\n';
      }
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
};

exports.getBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, { image: 1 }).lean();
    if (!blog || !blog.image) return res.status(404).json({ error: "Image not found" });
    res.json({ image: blog.image });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
};
