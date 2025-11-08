const groupModel=require('../models/group');
const message=async (req,res)=>{
    try{
        const {message}=req.body;
        const userId=req.user.id;
        const newMessage=await groupModel.create({message:message,userId:userId});
        res.status(201).json({message:'Message sent successfully',data:newMessage});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Error sending message',error:err.message});
    }


}
module.exports={
    message
};