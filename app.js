const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

const port = 4000;
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/Nostalgia', { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle API requests for creating users
const User = require('./models/user');

app.post('/api/users', (req, res) => {
    const { username, password, email } = req.body;
    const newUser = new User({ username, password, email });

    newUser.save()
        .then((savedUser) => {
            console.log('New User created:', savedUser);
            res.send('User created successfully!');
        })
        .catch((err) => {
            console.error('Error creating user:', err);
            res.status(500).send('Error creating user');
        });
});

app.put('/api/users', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ username }, { password, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        console.log('User updated:', updatedUser);
        res.send('User updated successfully!');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});
// WebSocket handling
io.on('connection', (socket) => {
   // console.log('A user connected');

    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`User connected with username: ${username}`);
    });

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        console.log(`Message from ${msg.sender}: ${msg.content}`);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.username}`);
    });
});

// Serve your React app or static files
app.use(express.static('public'));

// Start the Express.js server
http.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});
