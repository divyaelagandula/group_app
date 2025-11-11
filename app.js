const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const {Server} = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();
const User=require('./models/user');
const db = require('./utils/dbconncetion');
const indexModels = require('./models/index');

// Import your router/controller functions
const groupController = require('./routes/group'); // Assuming this handles the /group routes
const groupHandlers = require('./controllers/groupcontroller'); // Import the handlers directly

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use('/user', require('./routes/user'));
app.use('/group', groupController);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server);

io.use(async (socket, next) => {
    try{
            const token = socket.handshake.auth.token;
            if(!token){
                return next(new Error('Authentication error'));
            }
            const decode=jwt.verify(token,"kavyadivya");
            if(!decode){
                return next(new Error('invalide token or expired'));
            }
            const user=await User.findByPk(decode.id);
            if(!user){
                return next(new Error('user not found'));
            }
            console.log('sender user info to socket:',user);
            socket.user=user;
            next();
    }

    // Here you would normally verify the token and extract user info
    catch(err){
        console.error('Socket authentication error:', err);
        next(new Error('internal server error'));
    }
});
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('chat-message', (message) => {
        console.log('recived from user:', socket.user.name, 'message:', message);

        io.emit('chat-message', {username:socket.user.name,message:message,userId:socket.user.id}); // Broadcast to all connected clients
           });
});

db.sync()
    .then(() => {
        console.log('Database synchronized successfully.');
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port} (HTTP & socket.io)`);
        });
    })
    .catch(err => {
        console.error('Error synchronizing the database:', err);
    });