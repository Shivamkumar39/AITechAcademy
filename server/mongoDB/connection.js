const mongoose=require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI || "mongodb+srv://blogging:86869391ts@cluster0.kvfdw0c.mongodb.net/?retryWrites=true&w=majority"

const mongoConnection=()=>{
  try {
    mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true})
    console.log("MongoDB Connected")
    
  } catch (error) {
    console.log("Error while connecting mongoDB")
  }
}
module.exports=mongoConnection