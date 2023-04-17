function rolecheck(permittedroles){
    return (req,res,next)=>{
        const userrole=req.role
        if(permittedroles.includes(userrole)){
            return next()
        }else{
            return res.status(400).json({"msg":"Not authorised"})
        }
    }
}
module.exports=rolecheck