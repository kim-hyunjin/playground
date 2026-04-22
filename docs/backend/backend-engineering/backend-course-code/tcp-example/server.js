/**
 * TCP Server Example
 * 
 * This example demonstrates how to create a TCP server in Node.js using the 'net' module.
 * The server listens for incoming connections on port 3000 and responds to client messages.
 * 
 * TCP (Transmission Control Protocol) is a connection-oriented protocol that:
 * - Guarantees delivery of messages
 * - Guarantees order of messages
 * - Provides error checking and recovery
 * - Is more reliable but has more overhead than UDP
 * - Is useful for applications where reliability is more important than speed
 */

const net = require('net');

// Define the port and host the server will listen on
const PORT = 3000;
const HOST = '127.0.0.1';

// Create a TCP server
const server = net.createServer((socket) => {
  // Get client information
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${clientAddress}`);
  
  // Set encoding for the socket
  socket.setEncoding('utf8');
  
  // Event handler for when data is received from a client
  socket.on('data', (data) => {
    console.log(`Message from ${clientAddress}: ${data}`);
    
    // Create a response message
    const response = `Server received: ${data}`;
    
    // Send the response back to the client
    socket.write(response);
    console.log(`Response sent to ${clientAddress}`);
  });
  
  // Event handler for when a client disconnects
  socket.on('end', () => {
    console.log(`Client disconnected: ${clientAddress}`);
  });
  
  // Event handler for socket errors
  socket.on('error', (err) => {
    console.error(`Socket error from ${clientAddress}:\n${err.stack}`);
    socket.end();
  });
  
  // Send a welcome message to the client
  socket.write('Welcome to the TCP server! Type a message and press Enter to send.');
});

// Event handler for server errors
server.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

// Start the server and listen for connections
server.listen(PORT, HOST, () => {
  console.log(`TCP Server listening on ${HOST}:${PORT}`);
  console.log(`TCP server started. Press Ctrl+C to stop.`);
});