const mongoose = require('mongoose');
const slugify = require('slugify');
const Blog = require('../models/Blog');
require('dotenv').config();

const mongoConnection = require('../mongoDB/connection');

const generateSlugs = async () => {
  try {
    await mongoConnection();
    console.log("Connected to MongoDB");

    const blogs = await Blog.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Found ${blogs.length} blogs without slugs.`);

    for (const blog of blogs) {
      const baseSlug = slugify(blog.title || '', { lower: true, strict: true });
      let slug = baseSlug || Date.now().toString();
      let slugCounter = 1;
      
      // Keep checking if the slug exists (excluding the current blog)
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${slugCounter}`;
        slugCounter++;
      }

      blog.slug = slug;
      await blog.save();
      console.log(`Updated blog ${blog._id} with slug: ${slug}`);
    }

    console.log("Finished generating slugs.");
    process.exit(0);
  } catch (error) {
    console.error("Error generating slugs:", error);
    process.exit(1);
  }
};

generateSlugs();
