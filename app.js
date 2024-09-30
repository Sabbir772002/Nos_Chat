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
    const { id, sender, receiver, content, time,date,img,image } = req.body;
    const [month, day, year] = date.split('/'); 

    const parsedDate = new Date(`${year}-${month}-${day}`);

    const newMessage = new Message({ id, sender, receiver, content, time, date: parsedDate,
        img,image });

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
app.put('/api/messages', (req, res) => {
    const { id, sender, receiver, content, time,date,img,image } = req.body;
    const [month, day, year] = date.split('/'); 

    const parsedDate = new Date(`${year}-${month}-${day}`);

    const newMessage = new Message({ id, sender, receiver, content, time, date: parsedDate,
        img,image });

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

app.patch('/api/messages', (req, res) => {
    const { id, sender, receiver, content, time,date,img,image } = req.body;
    const [month, day, year] = date.split('/'); 

    const parsedDate = new Date(`${year}-${month}-${day}`);
    
    const newMessage = new Message({ id, sender, receiver, content, time, date: parsedDate,
        img,image });
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

app.get('/api/userbox/:username', async (req, res) => {
    const { username } = req.params;
    const usernameRegex = new RegExp(`^${username}$`, 'i');
    
    try {
        // Find messages where the given username appears as sender or receiver
        const messages = await Message.find({
            $or: [
                { receiver: usernameRegex },
                { sender: usernameRegex }
            ]
        }).sort({ date: -1, time: -1 });

        // Extract unique usernames from messages
        const uniqueUsernames = [...new Set(messages.flatMap(message =>
            message.sender.toLowerCase() === username.toLowerCase() ? message.receiver.toLowerCase() : message.sender.toLowerCase()
        ))];

        // Determine online status and last seen time for each unique username
        const usersStatus = await Promise.all(uniqueUsernames.map(async (user) => {
            // Check if the user is online
            const online = Object.values(clients).map(u => u.toLowerCase()).includes(user);
            // Find last seen time if user is not online
            const lastSeen = online ? '' : await getSeen(user);
            return { username: user, online, lastSeen };
        }));

        console.log('Users list:', usersStatus);
        res.status(200).json(usersStatus);
    } catch (err) {
        console.error('Error fetching usernames:', err);
        res.status(500).json({ error: 'Error fetching usernames' });
    }
});

// Function to retrieve last seen time for a user
async function getSeen(username) {
    try {
        const userDoc = await Seen.findOne({ user: username });
        return userDoc ? `${userDoc.date} ${userDoc.time}` : 'Unknown';
    } catch (error) {
        console.error('Error retrieving last seen time:', error);
        return 'Unknown';
    }
}

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

// Emit user status every 5 minutes
setInterval(emitusers,  60 * 1000); // 5 minutes in milliseconds
async function emitusers() {
    try {
        // Find unique users from OnlineUser and Seen collections
        const onlineUserDocs = await OnlineUser.find({});
        const seenUserDocs = await Seen.find({});
        
        // Extract usernames from OnlineUser and Seen documents
        const onlineUsers = onlineUserDocs.map(user => user.user.toLowerCase());
        const seenUsers = seenUserDocs.map(user => user.user.toLowerCase());

        // Combine unique usernames from both collections
        const uniqueUsers = Array.from(new Set([...onlineUsers, ...seenUsers]));

        // Map each user to check if they are currently online
        const usersStatus = uniqueUsers.map(username => {
            const isOnline = onlineUsers.includes(username);
            const lastSeen = isOnline ? '' : getLastSeen(seenUserDocs, username);
            return { username, online: isOnline, lastSeen };
        });

        console.log('Users status:', usersStatus);

        // Emit users status to all connected clients
        io.emit('users status', usersStatus);
    } catch (error) {
        console.error('Error updating online users:', error);
    }
}
function getLastSeen(seenUserDocs, username) {
    const userDoc = seenUserDocs.find(user => user.user.toLowerCase() === username.toLowerCase());
    return userDoc ? `${userDoc.date} ${userDoc.time}` : 'Unknown';
}

let previousOnlineUsers = []; // Store previous online users

async function updateOnlineUsers() {
    // Get the list of all connected users without duplicates (case-insensitive)
    const onlineUsers = Object.values(clients).map(username => username.toLowerCase()).filter((username, index, self) =>
        self.indexOf(username) === index
    );

    try {
        // Update the OnlineUser collection
        await OnlineUser.deleteMany({});
        // Insert the updated list of online users
        const onlineUsersObjects = onlineUsers.map(username => ({ user: username }));
        await OnlineUser.insertMany(onlineUsersObjects);
        console.log('Updated online users');
    } catch (error) {
        console.error('Error updating online users:', error);
    }
    // Update last seen time for users not in the current online users list
    const usersNotOnlineAnymore = previousOnlineUsers.filter(username => !onlineUsers.includes(username));
    try {
        console.log("oneline users ",onlineUsers);
        console.log("not online anymore....");
        console.log(usersNotOnlineAnymore);
        const bulkOperations = usersNotOnlineAnymore.map(user => {
            return {
                updateOne: {
                    filter: { user: user },
                    update: {
                        $set: { 
                            time: new Date().toLocaleTimeString(), 
                            date: new Date().toLocaleDateString() 
                        }
                    },
                    upsert: true
                }
            };
        });
        
        await Seen.bulkWrite(bulkOperations);
        console.log('Updated last seen time');
    } catch (error) {
        console.error('Error updating last seen time:', error);
    }

    // Update previousOnlineUsers with current onlineUsers for the next comparison
    previousOnlineUsers = onlineUsers;
}

// Call updateOnlineUsers every minute
setInterval(updateOnlineUsers, 60 * 1000);

// Serve your React app or static files
app.use(express.static('public'));

// Start the Express.js server
http.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});