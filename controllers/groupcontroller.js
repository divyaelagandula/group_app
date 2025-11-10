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
        const { message } = req.body;
        const userId = req.user.id;

        // 1. Save to database
        const newMessage = await groupModel.create({ message: message, userId: userId });
        
        // 2. Fetch the sender's name for broadcasting
        const sender = await User.findByPk(userId, { attributes: ['name'] });

        // 3. Create the complete message object for broadcast
        const broadcastData = {
            id: newMessage.id,
            message: newMessage.message,
            userId: userId,
            userName: sender ? sender.name : 'Unknown'
        };

        // We will broadcast this from the main server file, after this function is called.

        res.status(201).json({ 
            message: 'Message sent successfully', 
            data: broadcastData 
        });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Error sending message', error: err.message });
    }
}

const getmessages = async (req, res) => {
    try {
        // Fetch all messages and include the associated User's name for history loading
        const responses = await groupModel.findAll({
            order: [['createdAt', 'ASC']],
            include: [{
                model: User,
                attributes: ['name']
            }]
        });
        console.log(responses);

        const messagesWithNames = responses.map(msg => ({
            id: msg.id,
            message: msg.message,
            userId: msg.userId,
            userName: msg.user ? msg.user.name : 'Unknown',
            createdAt: msg.createdAt
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

module.exports = {
    message,
    getmessages
};