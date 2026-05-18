const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI || "mongodb+srv://shivamkumar098798_db_user:XoNlji2ounRrSzNv@cluster0.qgvdqzi.mongodb.net/?appName=Cluster0"

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