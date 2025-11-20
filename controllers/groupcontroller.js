const { where } = require('sequelize');
const groupModel = require('../models/group');
const User = require('../models/user');
// Assuming the WebSocket server instance is passed or accessible
// For simplicity, we'll assume the main server file imports and uses this function.

// 📢 NOTE: The `wss` object from your main server file needs to be accessible here
// or the broadcast logic needs to be moved back to the main server file.
// For this example, let's assume the broadcast logic is moved to the main server file (server.js/index.js)
// and this function will return the saved message object.

const message = async (req, res) => {
    try {
        const { message,roomName } = req.body;
        const userId = req.user.id;

        // 1. Save to database
        const newMessage = await groupModel.create({ message: message,roomName:roomName, userId: userId });
        
        
        res.status(201).json({ 
            message: 'Message sent successfully', 
            data: newMessage
        });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Error sending message', error: err.message });
    }
}

const getmessages = async (req, res) => {
    try {
        const id = req.user.id;
        const roomName=req.params.roomName
        // Fetch all messages and include the associated User's name for history loading
        const responses = await groupModel.findAll({
            where:{roomName:roomName},
            order: [['createdAt', 'ASC']],
            include: [{
                model: User,
                attributes: ['name']
            }]
        });
        console.log("getiinggggggg",responses);

        const messagesWithNames = responses.map(msg => ({
            message: msg.message,
            userId: msg.userId,
            username: msg.user ? msg.user.name : 'Unknown',
            timestamp: msg.timestamp,
            mediaUrl: msg.mediaUrl, 
            mimeType: msg.mimeType, 
            filename: msg.filename
        }));

        res.status(200).json({
            message: 'Messages retrieved successfully',
            data: {
                messages: messagesWithNames,
                currentUserId: req.user.id // Requires authentication middleware to attach req.user
            }
        });
    } catch (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).json({ message: 'Error retrieving messages', error: err.message });
    }
}

const checkingEmailExistsOrNot=async (req,res)=>{
    try{
        const {email}=req.body
        const result=User.findOne({where:{email:email}})
        if(!result){
            res.status(404).json({succses:false,message:'user not found'})
        }
        res.status(200).json({succses:true,message:'user found'})

    }catch(err){
        res.status(500).json({succses:false,message:err.message})
    }

}
module.exports = {
    message,
    getmessages,
    checkingEmailExistsOrNot
};