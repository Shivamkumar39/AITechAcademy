const Blog = require("../models/Blog.js");

exports.getStudyMaterials = async (req, res) => {
  try {
    const { q, tag } = req.query;

    // Base query to fetch study materials (including Btech cse and study material / study matterial variations)
    const query = {
      $and: [
        {
          $or: [
            { category: /study material/i },
            { category: /study matterial/i },
            { category: /btech cse/i },
            { tags: /study material/i },
            { tags: /study matterial/i },
            { tags: /btech cse/i }
          ]
        }
      ]
    };

    // Filter by tag if provided
    if (tag) {
      query.$and.push({ tags: new RegExp(`^${tag.trim()}$`, "i") });
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

    const materials = await Blog.find(query, { image: 0 })
      .sort({ createdAt: -1 })
      .lean();

    // Map through materials to ensure image paths are correctly resolved
    const updatedMaterials = materials.map(blog => {
      return {
        ...blog,
        image: `/blog-image/${blog._id}`
      };
    });

    res.json(updatedMaterials);
  } catch (error) {
    console.error("Error in getStudyMaterials:", error);
    res.status(500).json({ message: error.message || "Failed to fetch study materials" });
  }
};
