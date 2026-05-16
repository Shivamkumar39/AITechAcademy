const express = require("express");
const router = express.Router();
const authentication = require("../middleware/Auth.js");
const blogController = require("../controllers/blogController");

router.post("/addBlog", authentication, blogController.addBlog);
router.get("/blogs", blogController.getAllBlogs);
router.get("/blog/:id", blogController.getBlogById);
router.get("/blog-image/:id", blogController.getBlogImage);
router.get("/post/:slug", blogController.getBlogBySlug);
router.patch("/update/blog/:id", authentication, blogController.updateBlog);
router.delete("/delete/blog/:id", authentication, blogController.deleteBlog);

router.get("/admin/blogs", authentication, blogController.getAdminBlogs);
router.get("/admin/stats", authentication, blogController.getAdminStats);
router.get("/site-stats", blogController.getSiteStats);
router.get("/site-settings", blogController.getSiteSettings);
router.patch("/site-settings", authentication, blogController.updateSiteSettings);
router.post("/site-visit", blogController.trackSiteVisit);

router.get("/blogsByAuthorId/:id", blogController.getBlogsByAuthorId);
router.get("/categorycount", blogController.getCategoryCount);
router.get("/categories", blogController.getCategories);
router.get("/tag/:id", blogController.getBlogsByTag);
router.get("/blogscount", blogController.getBlogsCount);

router.get("/search/title?", blogController.searchBlogsByTitle);
router.get("/search/category?", blogController.searchBlogsByCategory);

router.patch("/bookmark/:id", blogController.bookmarkBlog);
router.patch("/unbookmark/:id", blogController.unbookmarkBlog);
router.patch("/like/:id", blogController.likeBlog);
router.patch("/unlike/:id", blogController.unlikeBlog);
router.patch("/comment/:id", blogController.addComment);

// Legacy/Fallback routes
router.patch("/bookmarks/:id", blogController.bookmarkBlog);

module.exports = router;
