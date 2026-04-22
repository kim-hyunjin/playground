const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Store active rooms
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room creation
  socket.on('create-room', (roomId) => {
    console.log(`Room created: ${roomId}`);
    
    // Join the room
    socket.join(roomId);
    
    // Store room info
    rooms[roomId] = {
      creator: socket.id,
      participants: [socket.id]
    };
    
    // Notify the client
    socket.emit('room-created', roomId);
  });

  // Handle room joining
  socket.on('join-room', (roomId) => {
    console.log(`User ${socket.id} joining room: ${roomId}`);
    
    // Check if room exists
    if (!rooms[roomId]) {
      socket.emit('error', 'Room does not exist');
      return;
    }
    
    // Join the room
    socket.join(roomId);
    rooms[roomId].participants.push(socket.id);
    
    // Notify the client about successful join
    socket.emit('room-joined', roomId, rooms[roomId].participants.filter(id => id !== socket.id));
    
    // Notify all other participants about the new user
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    console.log(`Offer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('offer', {
      offer: data.offer,
      source: socket.id
    });
  });

  socket.on('answer', (data) => {
    console.log(`Answer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('answer', {
      answer: data.answer,
      source: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    console.log(`ICE candidate from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      source: socket.id
    });
  });

  // Handle disconnection
  socket.on('leave-room', (roomId) => {
    handleLeaveRoom(socket, roomId);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and leave all rooms the user was in
    for (const roomId in rooms) {
      if (rooms[roomId].participants.includes(socket.id)) {
        handleLeaveRoom(socket, roomId);
      }
    }
  });
});

// Helper function to handle leaving a room
function handleLeaveRoom(socket, roomId) {
  console.log(`User ${socket.id} leaving room: ${roomId}`);
  
  // Check if room exists
  if (!rooms[roomId]) {
    return;
  }
  
  // Remove user from room
  rooms[roomId].participants = rooms[roomId].participants.filter(id => id !== socket.id);
  
  // Notify other participants
  socket.to(roomId).emit('user-left', socket.id);
  
  // Leave the socket.io room
  socket.leave(roomId);
  
  // If room is empty, delete it
  if (rooms[roomId].participants.length === 0) {
    console.log(`Room ${roomId} is empty, deleting`);
    delete rooms[roomId];
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});