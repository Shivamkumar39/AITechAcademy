const Blog = require("../models/Blog.js");

exports.getStudyMaterials = async (req, res) => {
  try {
    const { q, tag } = req.query;

    // Base query to fetch study materials (including Btech cse and study material / study matterial variations)
    const query = {
      $and: [
        {
          $or: [
            { category: { $regex: /study material/i } },
            { category: { $regex: /study matterial/i } },
            { category: { $regex: /btech cse/i } },
            { tags: { $regex: /study material/i } },
            { tags: { $regex: /study matterial/i } },
            { tags: { $regex: /btech cse/i } }
          ]
        }
      ]
    };

    // Filter by tag if provided
    if (tag) {
      query.$and.push({ tags: { $regex: new RegExp(`^${tag.trim()}$`, "i") } });
    }

    // Filter by search query if provided
    if (q) {
      query.$and.push({
        $or: [
          { title: { $regex: q.trim(), $options: "i" } },
          { description: { $regex: q.trim(), $options: "i" } }
        ]
      });
    }

    const materials = await Blog.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Map through materials to ensure image paths are correctly resolved
    const updatedMaterials = materials.map(blog => {
      let img = blog.image || "";
      if (typeof img === "string") {
        if (img.startsWith("data:") || img.length > 120000) {
          img = `/blog-image/${blog._id}`;
        } else if (img.startsWith("uploads/")) {
          img = `/${img}`;
        }
      }
      return {
        ...blog,
        image: img
      };
    });

    res.json(updatedMaterials);
  } catch (error) {
    console.error("Error in getStudyMaterials:", error);
    res.status(500).json({ message: error.message || "Failed to fetch study materials" });
  }
};
