const {Server} = require('socket.io');
const socketMiddleware=require('./middileware');
const chatHandlers=require('./hadlers/chat');
module.exports=(server)=>{
    const io = new Server(server,
    {
        cors:
        {
            origin: process.env.NODE_ENV === "production" ?
                false : ["http://localhost:3000", "http://localhost:5500"]
        },
    });
    socketMiddleware(io);
    io.on('connection', (socket) => {
        //here can have the multiple brodcasts personal-messages or group messages
    console.log('New client connected', socket.id);
    chatHandlers(io,socket);

    
});
   
}
 