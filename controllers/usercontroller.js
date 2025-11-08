const usermodel=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const signup=async (req,res)=>{
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password=hashedPassword;
        const response=await usermodel.create(req.body);
        res.status(201).json({message:'User registered successfully',data:response});
    }
    catch(err){
        console.log(err.name);
        if(err.name==='SequelizeUniqueConstraintError'){
            return res.status(400).json({message:'Email already exists'});
        }

        res.status(500).json({message:'Error registering user',error:err.message});
    }

}
function generateToken(userId){
    return jwt.sign({id:userId},"kavyadivya")
}
const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await usermodel.findOne({where:{email:email}});
        if(!user){
            return  res.status(404).json({message:'User not found'});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid password'});
        }
        res.status(200).json({message:'Login successful',data:user,token:generateToken(user.id)});
    }
    catch(err){
        res.status(500).json({message:'Error logging in',error:err.message});
    }
}
module.exports={
    signup,
    login
}