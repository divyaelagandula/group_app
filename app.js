const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const {Server} = require('socket.io');
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


io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('message', (message) => {
        io.emit('message', message); // Broadcast to all connected clients
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