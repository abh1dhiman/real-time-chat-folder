const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};  // To store usernames with socket ids

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // When a user sets their username
    socket.on('set username', (username) => {
        users[socket.id] = username; // Store username with socketid
        console.log(`Username for socket ${socket.id}: ${username}`);
    });

    // When a user sends a chat message
    socket.on('chat message', (msg) => {
        // Get the username for the current socket id
        const username = users[socket.id] || 'Anonymous';
        
        // Send the message with the username to all clients
        io.emit('chat message', `${username}: ${msg}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`user disconnected: ${users[socket.id]}`);
        delete users[socket.id]; // Remove the username when the user disconnects
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
