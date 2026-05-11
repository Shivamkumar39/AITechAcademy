const express = require("express");
const Blog = require("../models/Blog.js");
const router = express.Router();
const text = require("html-to-text");
const request = require("request");
const Users = require("../models/User.js");
const SiteStats = require("../models/SiteStats.js");
const SiteSettings = require("../models/SiteSettings.js");
const BASE_VISITS = 1010;
const authentication = require("../middleware/Auth.js");
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Helper to set cache headers
const setCache = (res, seconds = 60) => {
  if (process.env.NODE_ENV === 'production') {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
};

router.post("/addBlog", authentication, async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Only admin can add articles" });
  }
  const d = new Date();
  const date = +d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
  const { title, authorid, image, description, category, readtime, tags } = req.body;
  const authorImage = "https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png";
  const authorName = "shivam_kushwaha";
  const data = {
    title: String(title || '').trim(),
    authorid: authorid || req.userId || null,
    authorImage,
    authorName,
    image: String(image || '').trim(),
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map((tag) => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(req.body.pdfLinks) ? req.body.pdfLinks : [],
    publishDate: date,
  };
  const blog = new Blog(data);
  try {
    await blog.save();
    res.json({ message: "blog added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});

router.get("/blogs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // Default to 100 for now to not break front-end
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({}).sort({ _id: -1 }).skip(skip).limit(limit).lean();
    setCache(res, 300); // 5 min cache
    res.json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Atomic view increment and fetch
    const blog = await Blog.findByIdAndUpdate(
      id, 
      { $inc: { views: 1 } }, 
      { new: true }
    ).lean();
    
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    setCache(res, 60); // 1 min cache for specific blog
    res.json({ message: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.patch("/update/blog/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const d = new Date();
  const date = monthNames[d.getMonth()] + " " + d.getDate();
  const { title, authorid, image, description, category, readtime, authorImage, tags } = req.body;
  const data = {
    title: String(title || '').trim(),
    authorid: authorid,
    image: String(image || '').trim(),
    description: String(description || '').trim(),
    category: String(category || '').trim(),
    readtime: String(readtime || '').trim(),
    tags: Array.isArray(tags) ? tags.map((tag) => String(tag || '').trim()).filter(Boolean) : [],
    pdfLinks: Array.isArray(req.body.pdfLinks) ? req.body.pdfLinks : [],
    authorName: "shivam_kushwaha",
    authorImage: authorImage,
    publishDate: "Edited " + date,
  };

  try {
    const blog = await Blog.findById(id).lean();
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    
    if (blog.authorid == req.userId || req.rootUser.role === "admin") {
      await Blog.findByIdAndUpdate(id, { $set: data });
      res.json({ success: "Updated" });
    } else {
      res.status(403).json({ message: "Cannot update others blog" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

router.delete("/delete/blog/:id", authentication, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).lean();
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
    console.log(error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

router.get("/admin/blogs", authentication, async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const blogs = await Blog.find({}).sort({ _id: -1 }).lean();
    res.json({ blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch admin blogs" });
  }
});

router.get("/admin/stats", authentication, async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  try {
    const [totalBlogs, totalUsers, totalViews, siteStats] = await Promise.all([
      Blog.countDocuments(),
      Users.countDocuments(),
      Blog.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]),
      SiteStats.findOne({ key: "global" }).lean()
    ]);

    const blogViews = totalViews[0]?.views || 0;
    const visits = siteStats?.totalVisits || BASE_VISITS;
    
    res.json({
      totalBlogs,
      totalUsers,
      totalViews: blogViews + visits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

router.get("/site-stats", async (req, res) => {
  try {
    const [totalViews, site] = await Promise.all([
      Blog.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]),
      SiteStats.findOne({ key: "global" }).lean()
    ]);
    
    const blogViews = totalViews[0]?.views || 0;
    const visits = site?.totalVisits || BASE_VISITS;
    setCache(res, 600); // 10 min cache for stats
    res.json({ totalViews: blogViews + visits, totalVisits: visits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch site stats" });
  }
});

router.get("/site-settings", async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: "global" }).lean();
    setCache(res, 3600); // 1 hour cache for settings
    res.json({ settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
});

router.patch("/site-settings", authentication, async (req, res) => {
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
    ).lean();
    res.json({ settings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save site settings" });
  }
});

router.post("/site-visit", async (req, res) => {
  try {
    const site = await SiteStats.findOneAndUpdate(
      { key: "global" },
      { $setOnInsert: { totalVisits: BASE_VISITS }, $inc: { totalVisits: 1 } },
      { upsert: true, new: true }
    ).lean();
    res.json({ totalVisits: site.totalVisits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to track site visit" });
  }
});

router.get("/blogsByAuthorId/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ authorid: id }).lean();
    res.json({ Blogs: blogs });
  } catch (error) {
    res.json({ err: error });
  }
});

router.get("/categorycount", async (req, res) => {
  try {
    const categories = ["blockchain", "fashion", "technology", "business", "health", "fitness", "javascript", "video"];
    const counts = await Promise.all(categories.map(cat => 
      Blog.countDocuments({ category: { $regex: new RegExp(`^${cat}(s)?$`, 'i') } })
    ));
    
    const result = {};
    categories.forEach((cat, i) => result[cat] = counts[i]);
    setCache(res, 1800); // 30 min cache
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const [categories, tags] = await Promise.all([
      Blog.distinct("category"),
      Blog.distinct("tags")
    ]);
    const suggestions = Array.from(new Set([...(categories || []), ...(tags || [])]));
    setCache(res, 3600);
    res.json({ categories, tags, suggestions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/tag/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ $or: [{ category: id }, { tags: id }] }).lean();
    setCache(res, 300);
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tagged blogs" });
  }
});

router.get("/search/title", async (req, res) => {
  const { q } = req.query;
  try {
    const data = await Blog.find({ title: { $regex: q, $options: "i" } }).limit(20).lean();
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/search/category", async (req, res) => {
  const { q } = req.query;
  try {
    const data = await Blog.find({ category: { $regex: q, $options: "i" } }).limit(20).lean();
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/bookmark/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json("User not found");
    
    if (!user.bookmarks.includes(id)) {
      await user.updateOne({ $push: { bookmarks: id } });
      res.json("Bookmarked");
    } else {
      res.json("already Bookmarked");
    }
  } catch (error) {
    res.status(500).json("Error bookmarking");
  }
});

router.patch("/unbookmark/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    await Users.findByIdAndUpdate(userId, { $pull: { bookmarks: id } });
    res.json("unbookmarked");
  } catch (error) {
    res.status(500).json("Error unbookmarking");
  }
});

router.patch("/like/:id", async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  try {
    // Atomic update to prevent race conditions and extra queries
    const result = await Blog.updateOne(
      { _id: id, likes: { $ne: userId } },
      { $push: { likes: userId } }
    );
    if (result.modifiedCount === 0) {
      return res.json("You already liked it or blog not found");
    }
    res.json("Liked");
  } catch (error) {
    res.status(500).json("Error liking");
  }
});

router.patch("/unlike/:id", async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  try {
    await Blog.updateOne({ _id: id }, { $pull: { likes: userId } });
    res.json("unliked");
  } catch (error) {
    res.status(500).json("Error unliking");
  }
});

router.patch("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, info } = req.body;
  if (!info || !info.toString().trim()) {
    return res.status(400).json({ error: "Comment text is required" });
  }
  const comment = {
    userId: String(userId || "anonymous"),
    info: String(info).trim(),
    blogId: String(id),
  };
  try {
    await Blog.updateOne({ _id: id }, { $push: { comments: comment } });
    res.json({ message: "Comment added", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
