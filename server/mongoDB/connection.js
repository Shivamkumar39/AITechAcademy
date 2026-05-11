const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI || "mongodb+srv://blogging:86869391ts@cluster0.kvfdw0c.mongodb.net/?retryWrites=true&w=majority"

const mongoConnection = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}
module.exports = mongoConnection