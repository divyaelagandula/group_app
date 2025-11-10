const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const websocket = require('ws');
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
app.use('/group', groupController); // Use the router for HTTP API calls

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const server = http.createServer(app);
const wss = new websocket.Server({ server });
let sockets = [];

// --- WebSocket Connection and Broadcast Logic ---
wss.on('connection', (ws) => {
    console.log('New client connected');
    sockets.push(ws);

    ws.on('message', (message) => {
        //what we r recived from frontend via websocket
        console.log('Received message from client via WebSocket:', message);
        //whatever message is received from any client..it will be broadcasted to all clients
         sockets.forEach(socket => {
                    console.log('Broadcasting message to all clients:', message);
                    if (socket.readyState === websocket.OPEN) {
                        socket.send(message);//broadcasting to all clients.it includes sender also
                   //it is handled in views/group.html --- socket.onmessage = async function(event) {
                    }
                })
           });
    
    ws.on('close', () => {
        sockets = sockets.filter(socket => socket !== ws);
        console.log('Client disconnected');
    });
});

// 📢 IMPORTANT: Override the HTTP POST endpoint to include WebSocket broadcast
app.post('/group/message', (req, res, next) => {
    // 1. Call the controller to save and fetch broadcast data
    groupHandlers.message(req, res)
        .then(httpResponse => {
            // Check if message was successfully created (status 201)
            if (httpResponse.statusCode === 201) {
                const broadcastData = httpResponse.json.data;
                // 2. Broadcast the saved data to all connected clients
                const dataString = JSON.stringify(broadcastData);
                sockets.forEach(socket => {
                    if (socket.readyState === websocket.OPEN) {
                        socket.send(dataString);
                    }
                });
            }
            // 3. Send the HTTP response back to the client
            res.status(httpResponse.statusCode).json(httpResponse.json);

        })
        .catch(err => {
            // Handle error from the controller
            res.status(500).json({ message: 'Error processing message', error: err.message });
        });
});
// --------------------------------------------------------------------------


db.sync()
    .then(() => {
        console.log('Database synchronized successfully.');
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port} (HTTP & WS)`);
        });
    })
    .catch(err => {
        console.error('Error synchronizing the database:', err);
    });