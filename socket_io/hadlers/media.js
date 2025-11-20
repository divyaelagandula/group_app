const { now } = require("sequelize/lib/utils");
const group=require('../../models/group')

module.exports =  (io, socket) => {
  

    socket.on('media', async ({ s3url,file, currentRoomName }) => {
        console.log(`Received from user: ${socket.user.name}, Room: ${currentRoomName}, s3url: ${s3url}`);
        await group.create({roomName:currentRoomName,mediaUrl:s3url,mimeType:file.mimetype,filename:file.originalname,timestamp:Date.now(),userId:socket.user.id})
        // 4. INCLUDE the room name in the payload for client-side filtering
        io.to(currentRoomName).emit('media', {
            mediaUrl:s3url,
             mimeType:file.mimetype,
              filename:file.originalname,
               timestamp:Date.now(), 
            username: socket.user.name,
           currentRoomName:currentRoomName,
            userId: socket.user.id,
         
        });
    }); 
};