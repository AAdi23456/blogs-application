const mongoose=require("mongoose")
const Schema= mongoose.Schema({
 
 blogs:String,
 userid:String
})
const model=mongoose.model("blogs",Schema)
module.exports=model