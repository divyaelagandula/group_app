module.exports=(io,socket)=>{
socket.on('chat-message', (message) => {
        console.log('recived from user:', socket.user.name, 'message:', message);

        io.emit('chat-message', {username:socket.user.name,message:message,userId:socket.user.id}); // Broadcast to all connected clients
           });
}