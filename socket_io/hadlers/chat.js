module.exports = (io, socket) => {
    socket.on('join-room', (roomName) => {
        // 1. Leave the old room if the user was in one
        if (socket.currentRoom) {
            socket.leave(socket.currentRoom);
            console.log(`User ${socket.user.name} left room: ${socket.currentRoom}`);
        }
        
        // 2. Join the new room
        socket.join(roomName);
        
        // 3. Track the new room
        socket.currentRoom = roomName; 
        
        console.log(`User ${socket.user.name} joined room: ${roomName}`);
    });

    socket.on('new-message', ({ message, currentRoomName }) => {
        console.log(`Received from user: ${socket.user.name}, Room: ${currentRoomName}, Message: ${message}`);

        // 4. INCLUDE the room name in the payload for client-side filtering
        io.to(currentRoomName).emit('new-message', {
            username: socket.user.name,
            message: message,
            userId: socket.user.id,
            currentRoomName: currentRoomName // <-- FIX: Added this property
        });
    }); 
};