const mongoose=require("mongoose")
const Schema= mongoose.Schema({
 
  email: {type: String, required: true,unique:true},
  password: {type: String, required: true},
  role:{type: String, required: true,default:"user",enum:["moderator","user"]}
})
const model=mongoose.model("reg",Schema)
module.exports=model