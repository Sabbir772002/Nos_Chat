# Nos_Chat - Real-time Chat Backend

A comprehensive real-time chat backend server built with Express.js, Socket.IO, and MongoDB. Nos_Chat powers the messaging and communication features for the Nostalgia platform, enabling users to engage in real-time conversations with WebSocket and HTTP support.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Database Models](#database-models)
- [License](#license)

## 🎯 Overview

Nos_Chat is a robust Node.js-based chat backend that provides real-time messaging capabilities. It uses Express.js for the HTTP server, Socket.IO for real-time bidirectional communication, and MongoDB for data persistence. The server supports both private messaging and group chat functionality with features like message persistence, online user tracking, message read receipts, and user presence indicators.

**Key Features:**
- Real-time messaging with Socket.IO
- WebSocket support with fallback to HTTP polling
- Message persistence with MongoDB
- Online user tracking
- Message seen/read status
- Private messaging support
- Chat room management
- CORS support for cross-origin requests
- HTTPS support with SSL certificates

## 🛠 Tech Stack

### Core Framework
- **Express.js 4.21.2** - Fast, unopinionated web framework for Node.js
- **Node.js** - JavaScript runtime

### Real-time Communication
- **Socket.IO 4.7.5** - Real-time bidirectional event-based communication
- **WebSocket (ws 8.17.0)** - WebSocket client and server implementation

### Database
- **MongoDB** - NoSQL document database
- **Mongoose 8.4.0** - MongoDB object modeling for Node.js

### Utilities
- **Axios 1.7.9** - HTTP client for making requests
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **UUID 9.0.1** - Unique identifier generation
- **Body Parser** - Middleware for parsing request bodies

### Security
- **HTTPS/SSL** - TLS certificates for secure communication (cert.pem, key.pem)

## 📁 Project Structure

```
Nos_Chat/
├── models/                       # MongoDB Mongoose models
│   ├── user.js                   # User model
│   ├── message.js                # Message model
│   ├── ChatMessage.js            # Chat message model
│   ├── ChatRoom.js               # Chat room model
│   ├── OnlineUser.js             # Online user tracking
│   ├── Seen.js                   # Message seen/read status
│   └── pbvt.js                   # Private message model
│
├── app.js                        # Main Express application
├── vid.js                        # Video-related functionality
├── package.json                  # Node.js dependencies
├── package-lock.json             # Dependency lock file
├── cert.pem                      # SSL certificate
├── key.pem                       # SSL private key
├── .gitignore                    # Git ignore file
└── README.md                     # This file
```

## ✨ Features

### Messaging
- **Real-time Messages** - Instant message delivery using Socket.IO
- **Message Persistence** - All messages stored in MongoDB
- **Private Messaging** - One-to-one private conversations
- **Group Chats** - Chat room support for multiple users
- **Message History** - Retrieve previous messages between users
- **Message Content** - Support for text, timestamps, dates, and images

### User Status
- **Online Presence** - Track which users are currently online
- **User Tracking** - Monitor active users in real-time
- **Connection Management** - Handle user connections and disconnections

### Message Features
- **Read Receipts** - Track message seen/read status
- **Message Metadata** - Include sender, receiver, timestamps, and dates
- **Image Support** - Share images and media in messages
- **UUID Generation** - Unique message identifiers

### Communication Protocols
- **Socket.IO** - Primary real-time communication protocol
- **WebSocket** - Native WebSocket support
- **HTTP API** - REST endpoints for message operations

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or remote)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sabbir772002/Nos_Chat.git
   cd Nos_Chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB connection**
   - Update the MongoDB connection string in `app.js`
   - Default: `mongodb://localhost:27017/Nostalgia`
   - For remote MongoDB, update the connection URL accordingly

4. **SSL/TLS Certificates**
   - The project includes `cert.pem` and `key.pem` for HTTPS support
   - Generate new certificates if needed:
     ```bash
     openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
     ```

5. **Start the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node app.js
   ```

## 🏃 Running the Server

The server runs on **port 5000** by default.

### Start Server
```bash
npm start
```

### Server will:
- Connect to MongoDB
- Listen for HTTP requests
- Listen for WebSocket connections
- Enable CORS for cross-origin requests
- Support both Socket.IO and raw WebSocket connections

## 📡 API Endpoints

### Message Endpoints

**POST /api/messages**
- Create a new message
- Body: `{ id, sender, receiver, content, time, date, img, image }`
- Response: Saved message object

**GET /api/messages**
- Retrieve messages between two users
- Query: `?id1=<sender>&id2=<receiver>`
- Response: Array of messages

**PUT /api/messages**
- Update a message
- Body: `{ id, sender, receiver, content, time, date, img, image }`
- Response: Updated message object

**PATCH /api/messages**
- Partially update a message
- Body: Message object with fields to update
- Response: Updated message object

## 🔌 WebSocket Events

### Client to Server Events
- `send-message` - Send a message in real-time
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `online-status` - Update user online status
- `message-seen` - Mark message as seen

### Server to Client Events
- `receive-message` - Receive a new message
- `user-joined` - User joined the chat
- `user-left` - User left the chat
- `online-users` - List of currently online users
- `message-delivered` - Message delivery confirmation

## 💾 Database Models

### User Model
Stores user information and authentication details.

### Message Model
Stores individual messages with sender, receiver, content, timestamps, and metadata.

### ChatRoom Model
Manages group chat rooms and their members.

### OnlineUser Model
Tracks which users are currently online in real-time.

### Seen Model
Maintains message read/seen status for each message.

### Private Message Model (pbvt)
Handles private message routing and storage.

### ChatMessage Model
Extended message model for chat-specific features.

## 📄 License

This project is licensed under the ISC License.

---

**Project Version**: 1.0.0
**Last Updated**: February 2026

For questions or support, please contact the development team.
