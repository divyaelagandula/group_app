const jwt=require('jsonwebtoken');
const verify=async (req,res,next)=>{
    try{
        const token=req.headers.authorization;
        console.log("Token:", token);
        if(!token){
            return res.status(401).json({message:'No token provided'});
        }
        const decoded=jwt.verify(token,"kavyadivya");
        req.user=decoded;
        next();     
    }
    catch(err){
        res.status(500).json({message:'Authentication failed',error:err.message});
    }
    
}
module.exports={
    verify
};