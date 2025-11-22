const express = require('express');
const router = express.Router();
const middleware=require('../middileare/authentication')
const groupcontroller=require('../controllers/groupcontroller');
router.post('/message',middleware.verify,groupcontroller.message);
router.get('/getmessages/:roomName',middleware.verify,groupcontroller.getmessages);
router.post('/checkingEmailExistsOrNot',middleware.verify,groupcontroller.checkingEmailExistsOrNot)
module.exports=router;

// Path: GET /group/getarchivedmessages/:roomName?before_timestamp=...
router.get('/getarchivedmessages/:roomName', middleware.verify, async (req, res) => {
    try {
        const { roomName } = req.params;
        const { before_timestamp } = req.query; // The timestamp cursor
        const currentUserId = req.user.id; // Get user ID from middleware token payload

        if (!before_timestamp) {
            return res.status(400).json({ success: false, message: "Missing required 'before_timestamp' query parameter." });
        }

        const messages = await groupcontroller.getArchivedMessages(roomName, before_timestamp);

        // Map the results to a clean format expected by the frontend
        return res.status(200).json({
            success: true,
            data: {
                messages: messages.map(msg => ({
                    userId: msg.user.id, // Assuming senderId is the foreign key on the model
                    username: msg.user ? msg.user.name : 'Unknown User',
                    message: msg.message,
                    mediaUrl: msg.mediaUrl,
                    mimeType: msg.mimeType,
                    filename: msg.filename,
                    timestamp: msg.timestamp, // The timestamp field used as the cursor
                })),
                currentUserId: currentUserId
            }
        });

    } catch (error) {
        console.error("Error fetching archived messages:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
});

module.exports = router;