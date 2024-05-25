const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors()); // Use cors middleware
const OnlineUser = require('./models/OnlineUser');
const Seen = require('./models/Seen');

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
app.use(bodyParser.json());
const port = 5000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Nostalgia', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle API requests for creating users
const User = require('./models/user');
const Message = require('./models/message'); 



app.post('/api/messages', (req, res) => {
    const { id, sender, receiver, content, time,date,img } = req.body;
    const newMessage = new Message({ id, sender, receiver, content, time,date,img });

    newMessage.save()
        .then((savedMessage) => {
            console.log('Message saved:', savedMessage);
            res.status(200).json(savedMessage);
        })
        .catch((err) => {
            console.error('Error saving message:', err);
            res.status(500).send('Error saving message');
        });
});
app.get('/api/messages', (req, res) => {
    const { id1, id2 } = req.query; 
    const id11 = new RegExp(`^${id1}$`, 'i');
    const id12 = new RegExp(`^${id2}$`, 'i');
    
    Message.find({
        $or: [
            { sender: { $regex: id11 }, receiver: { $regex: id12 } },
            { sender: { $regex: id12 }, receiver: { $regex: id11 } }
        ]
    }).sort({date:1, time: 1 })
        .then((messages) => {
            console.log('Messages:', messages);
            res.status(200).json(messages);
        })
        .catch((err) => {
            console.error('Error fetching messages:', err);
            res.status(500).send('Error fetching messages');
        });
});
app.get('/api/userbox/:username', (req, res) => {
    const { username } = req.params;
    const usernameRegex = new RegExp(`^${username}$`, 'i');

    Message.find({
        $or: [
            { receiver: usernameRegex },
            { sender: usernameRegex }
        ]
    }).sort({ time: -1 }) // Sort by descending order of message time
    .then((messages) => {
        // Extract unique usernames from the messages
        const uniqueUsernames = [...new Set(messages.map(message => 
            message.sender.toLowerCase() === username.toLowerCase() ? message.receiver : message.sender
        ))];
        res.status(200).json(uniqueUsernames);
    })
    .catch((err) => {
        console.error('Error fetching usernames:', err);
        res.status(500).json({ error: 'Error fetching usernames' });
    });
});


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
// Object to track all connected clients
const clients = {};

io.on('connection', (socket) => {
    //console.log('A user connected');
    
    // Handle username setting
    socket.on('set username', (username) => {
        socket.username = username;
        clients[socket.id] = username;
        console.log(`User connected with username: ${username}`);
        console.log('Connected clients:', clients);
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
        // Remove the client from the tracking object
        delete clients[socket.id];
        console.log('Connected clients:', clients);
    });

});

// Serve your React app or static files
app.use(express.static('public'));

// Start the Express.js server
http.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});
