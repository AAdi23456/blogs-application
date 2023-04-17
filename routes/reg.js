const express=require("express")
const jwt=require("jsonwebtoken")
const blacklistmodel=require("../models/blacklist")
const regmodel=require("../models/reg")
const router=require("express").Router()
const bcrypt=require("bcrypt")
const auth=require("../middleware/auth")
const  rolecheck=require("../middleware/checkrole")
const blogs=require("../models/data")
router.post("/reg",async(req,res)=>{
    try {
        const {name,email,password,role}=req.body
        bcrypt.hash(password, 10,async function(err, hash) {
            if(hash){
                const user=new regmodel({name,email,password:hash,role})
                await user.save()
                return res.status(200).json({"msg":"reg success"})
            }else{
                return res.status(400).json({"msg":"reg failed"})
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({"msg":"Internal server error"})
    }
})
router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await regmodel.find({email})
        console.log(user)
       bcrypt.compare(password,user[0].password,function(err,result){
        if(result){
            return res.status(200).json({token:jwt.sign({userid:user[0]._id},"masai",{
                expiresIn:60
            }),
        refreshtoken:jwt.sign({userid:user[0]._id},"seckey",{expiresIn:60*3})})
        }else if(err){
            return res.status(400).json({"msg":"login failed"})
        }
       })
    } catch (error) {
        console.log(error);
        return res.status(400).json({"msg":"Internal server eroor"})
    }
   
})
router.post("/logout",async(req,res)=>{
try {
    const {token}=req.headers
    if(token){
        const tokenfordb=new blacklistmodel({token})
await tokenfordb.save()
return res.status(200).json({"msg":"logout success"})
    }else{
        return res.status(400).json({"msg":"please provide token"})
    }
} catch (error) {
    console.log(error);
    return res.status(400).json({"msg":"Internal server error"})
}
})
router.post("/create",auth,rolecheck(["user"]), async(req,res)=>{
try {
    const data=req.body
    const datatodb=new blogs(data)
    await datatodb.save()
    return res.status(200).json({"msg":"blog added"})
} catch (error) {
    console.log(error)
    return res.status(400).json({"msg":"Internal server error"})
}
})
router.patch("/update/:id",auth,rolecheck(["user"]), async(req,res)=>{
    try {
        const newdata=req.body
      const token=req.headers.auth
      const decoded=jwt.verify(token,"masai")
      if(decoded.userid){
        const {id}=req.params
        const data =await blogs.findByIdAndUpdate(id,newdata,{new:true})
        await data.save()
        return res.status(200).json({"msg":"blog updated"})
      }
    } catch (error) {
        console.log(error)
        return res.status(400).json({"msg":"Internal server error"})
    }
    })

    router.delete("/delete/:id",auth,rolecheck(["user"]), async(req,res)=>{
        try {
           
          const token=req.headers.auth
          const decoded=jwt.verify(token,"masai")
          console.log(decoded.userid);
         
            const {id} =req.params
          console.log(id);
            console.log("here");
            const data =await blogs.findByIdAndDelete(id)
            console.log(data);
            // await data.save()
            return res.status(200).json({"msg":"blog deleted"})
          
        } catch (error) {
            console.log(error)
            return res.status(400).json({"msg":"Internal server error"})
        }
        })
    router.get("/get",auth,rolecheck(["user","moderator"]),async(req,res)=>{
        try {
           
            const token=req.headers.auth
            const decoded=jwt.verify(token,"masai")
            if(decoded.userid){
             
            
              
              const data =await blogs.find({userid:decoded.userid})
              
              return res.status(200).json({data})
            }
          } catch (error) {
              console.log(error)
              return res.status(400).json({"msg":"Internal server error"})
          }
    })
    router.post("/refreshtoken",async(req,res)=>{
        try {
            const token =req.headers.refreshtoken
            const checkblacklist =await blacklistmodel.find({token})
            if(checkblacklist.length>0){
                return res.status(403).send({message:"please login againn"})}else{
                    const decoded=jwt.verify(token,"seckey")
                    if(decoded){
                       return res.status(200).json({token:jwt.sign({userid:user[0]._id},"masai")})
                        
                    }else{
                        return res.status(403).send({message:"please login again"})
                    }
                }
        } catch (error) {
            
            console.log(error)
            return res.status(400).json({"msg":"token expired"})
        }
        })
        router.delete("/moderator/:id",auth,rolecheck(["moderator"]),async(req,res)=>{
         try {
            const {id} =req.params
            console.log(id);
              console.log("here");
              const data =await blogs.findByIdAndDelete(id)
              console.log(data);
              // await data.save()
              return res.status(200).json({"msg":"blog deleted"})
         } catch (error) {
            return res.status(400).json({"msg":"something went wrong"})
         }
        })
module.exports=router