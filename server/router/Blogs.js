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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let totalBlogs = 0;

router.post("/addBlog", authentication, async (req, res) => {
  if (!req.rootUser || req.rootUser.role !== "admin") {
    return res.status(403).json({ error: "Only admin can add articles" });
  }
  const d = new Date();
  const date =
    +d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
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
    publishDate: date,
  };
  const blog = new Blog(data);
  try {
    await blog.save();
    res.json({ message: "blog added" });
    console.log("Admin added a blog");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save blog" });
  }
});
router.get("/blogs", async (req, res) => {
  try {
    await Blog.find({}, (err, e) => {
      if (err) console.log(err);
      res.json(e);
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    blog.views = (blog.views || 0) + 1;
    await blog.save();
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
    authorName: "shivam_kushwaha",
    authorImage: authorImage,
    publishDate: "Edited " + date,
  };
  const blog = await Blog.findOne({ _id: id });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  if (blog.authorid == req.userId || req.rootUser.role === "admin") {
    try {
      await Blog.findByIdAndUpdate(id, { $set: data });
      res.json({ success: "Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  } else {
    res.status(403).json({ message: "Cannot update others blog" });
  }
});
router.delete("/delete/blog/:id", authentication, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.authorid == req.userId || req.rootUser.role === "admin") {
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
    const blogs = await Blog.find({}).sort({ publishDate: -1 });
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
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await Users.countDocuments();
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);
    const siteStats = await SiteStats.findOne({ key: "global" });
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
    const totalViews = await Blog.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]);
    let site = await SiteStats.findOne({ key: "global" });
    if (!site) {
      site = await SiteStats.create({ key: "global", totalVisits: BASE_VISITS });
    }
    const blogViews = totalViews[0]?.views || 0;
    const visits = site?.totalVisits || BASE_VISITS;
    res.json({ totalViews: blogViews + visits, totalVisits: visits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch site stats" });
  }
});

router.get("/site-settings", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: "global" });
    if (!settings) {
      settings = await SiteSettings.create({ key: "global" });
    }
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
    );
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
    );
    res.json({ totalVisits: site.totalVisits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to track site visit" });
  }
});

router.get("/blogsByAuthorId/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ authorid: id });
    res.json({ Blogs: blogs });
  } catch (error) {
    res.json({ err: error });
  }
});
router.get("/categorycount", async (req, res) => {
  try {
    const blockchain = await Blog.countDocuments({ category: { $regex: /^blockchain$/i } });
    const fashion = await Blog.countDocuments({ category: { $regex: /^fashion$/i } });
    const technology = await Blog.countDocuments({ category: { $regex: /^technology$/i } });
    const business = await Blog.countDocuments({ category: { $regex: /^business$/i } });
    const health = await Blog.countDocuments({ category: { $regex: /^health$/i } });
    const fitness = await Blog.countDocuments({ category: { $regex: /^fitness$/i } });
    const javascript = await Blog.countDocuments({ category: { $regex: /^javascript$/i } });
    const video = await Blog.countDocuments({ category: { $regex: /^video(s)?$/i } });
    res.json({
      blockchain,
      fashion,
      technology,
      business,
      health,
      fitness,
      javascript,
      video,
    });
  } catch (error) {
    res.json(error);
  }
});
router.get("/categories", async (req, res) => {
  try {
    const categories = await Blog.distinct("category");
    const tags = await Blog.distinct("tags");
    const suggestions = Array.from(new Set([...(categories || []), ...(tags || [])]));
    res.json({ categories, tags, suggestions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
router.get("/tag/:id", async (req, res) => {
  const { id } = req.params;
  const blogs = await Blog.find({ $or: [{ category: id }, { tags: id }] });
  if (blogs) {
    res.json({ blogs: blogs });
  } else {
    res.json({ message: "No Blogs Available" });
  }
});

router.get("/blogscount", (req, res) => {
  // use mongoose to get the count of Users in the database
  Blog.count(function (err, count) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json({ count: count }); // return return the count in JSON format
    // console.log(count)
  });
});
router.get("/search/title?", async (req, res) => {
  const { q } = req.query;
  await Blog.find({ title: { $regex: q, $options: "$i" } })
    .then((data) => res.json(data))
    .catch((error) => res.json(error));
});
router.get("/search/category?", (req, res) => {
  const { q } = req.query;
  Blog.find({ category: { $regex: q, $options: "$i" } })
    .then((data) => res.json(data))
    .catch((error) => res.json(error));
});
router.patch("/bookmarks/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const blog = await Blog.findOne({ _id: id });
  const user = await Users.findOne({ _id: userId });
  if (user) {
    try {
      if (!user.bookmarks.includes(id)) {
        await user.updateOne({ $push: { bookmarks: id } });
        res.json("Bookmarked");
      } else {
        res.json("already Bookmarked");
      }
    } catch (error) {}
  }
});
router.patch("/bookmark/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(id, userId);
  const blog = await Blog.findOne({ _id: id });
  const user = await Users.findOne({ _id: userId });
  if (user) {
    try {
      if (!user.bookmarks.includes(id)) {
        await user.updateOne({ $push: { bookmarks: id } });
        res.json("Bookmarked");
      } else {
        res.json("already Bookmarked");
      }
    } catch (error) {}
  }
});
router.patch("/unbookmark/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const blog = await Blog.findOne({ _id: id });
  const user = await Users.findOne({ _id: userId });
  if (user) {
    try {
      if (user.bookmarks.includes(id)) {
        await user.updateOne({ $pull: { bookmarks: id } });
        res.json("unbookmarked");
      } else {
        res.json("bookmark first");
      }
    } catch (error) {}
  }
});
router.patch("/like/:id", async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  const blog = await Blog.findOne({ _id: id });
  if (blog) {
    if (!blog.likes.includes(userId)) {
      await blog.updateOne({ $push: { likes: userId } });
      res.json("Liked");
    } else {
      res.json("You already liked it");
    }
  } else {
    res.json("No blogs found");
  }
});
router.patch("/unlike/:id", async (req, res) => {
  const { id } = req.params;
  const userId = String(req.body.userId || "anonymous");
  const blog = await Blog.findOne({ _id: id });
  if (blog) {
    if (blog.likes.includes(userId)) {
      await blog.updateOne({ $pull: { likes: userId } });
      res.json("unliked");
    } else {
      res.json("You never liked it ");
    }
  } else {
    res.json("No blogs found");
  }
});
router.patch("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, info } = req.body;
  if (!info || !info.toString().trim()) {
    return res.status(400).json({ error: "Comment text is required" });
  }
  const blog = await Blog.findOne({ _id: id });
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  const comment = {
    userId: String(userId || "anonymous"),
    info: String(info).trim(),
    blogId: String(id),
  };
  try {
    await blog.updateOne({ $push: { comments: comment } });
    res.json({ message: "Comment added", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});
router.patch("/test", (req, res) => {
  console.log(req.body);
});
module.exports = router;
