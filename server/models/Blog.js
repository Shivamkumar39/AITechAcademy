const mongoose=require('mongoose')
const blogSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true

  },
  authorid:{
    type:String,
    required:false
  },
 authorImage:{
  type:String
 },
 authorName:{
  type:String
 },
  image:{
    type:String,
    required:true

  },
  description:{
    type:String,
    required:true

  },
  likes:{
    type:Array,
    default:[]
  },
  comments:[
    {
      userId:{
        type:String,
        required:true
      },
      info:{
        type:String,
        required:true
      },
    blogId:{
      type:String,
      required:true
    }
    }
  ],
  category:{
    type:String,
    required:true
  },
  tags: {
    type:[String],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  publishDate:{
    type:String,
    required:true
  },
  readtime:{
    type:String,
    required:true
  },
})
module.exports=mongoose.model("Blog",blogSchema)