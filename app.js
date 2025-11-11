const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User=require('./models/user');
const db = require('./utils/dbconncetion');
const indexModels = require('./models/index');
const socketIo=require('./socket_io/socket')

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
// This is a snippet of code, likely from a Node.js application using the Socket.IO library,
//  for initializing a Socket.IO server.
// The CORS configuration (specifically the origin setting) dictates which client 
// domains (origins) are allowed to connect to your Socket.IO server.


socketIo(server);



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