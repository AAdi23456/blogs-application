const jwt =require("jsonwebtoken")
const regmodel=require("../models/reg")
const blacklist=require("../models/blacklist")
const blogs=require("../models/data")
const router = require("../routes/reg")
const auth=async(req,res,next)=>{
    try {
        const token =req.headers.auth
        console.log(token);
        const checkblacklist =await blacklist.find({token})
        if(checkblacklist.length>0){
            return res.status(403).send({message:"please login againn"})
        }else{
            const decoded=jwt.verify(token,"masai")
            console.log(decoded);
            const {userid}=decoded
            req.body.userid=userid
            const data=await regmodel.findOne({_id:userid})
            console.log(data);
            const role=data?.role
            req.role=role
            next()
            return
        }
    } catch (error) {
       console.log(error);
        return res.status(400).send({message:"please login againnnn"})
    }
}

module.exports=auth