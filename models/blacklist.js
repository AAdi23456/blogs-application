const mongoose=require("mongoose")
const Schema= mongoose.Schema({
   token:{required:true,unique:true,type:String}
})
const model=mongoose.model("blacklist",Schema)
module.exports=model