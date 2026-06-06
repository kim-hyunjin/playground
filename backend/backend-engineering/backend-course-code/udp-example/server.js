/**
 * UDP Server Example
 * 
 * This example demonstrates how to create a UDP server in Node.js using the 'dgram' module.
 * The server listens for incoming messages on port 41234 and responds to the client.
 * 
 * UDP (User Datagram Protocol) is a connectionless protocol that:
 * - Does not guarantee delivery of messages
 * - Does not guarantee order of messages
 * - Is faster than TCP because it has less overhead
 * - Is useful for applications where speed is more important than reliability
 */

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

// Define the port the server will listen on
const PORT = 41234;
const HOST = '127.0.0.1';

// Event handler for when the server starts listening
server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Event handler for when the server receives a message
server.on('message', (message, remote) => {
  console.log(`Message from ${remote.address}:${remote.port}: ${message}`);
  
  // Create a response message
  const response = `Server received: ${message}`;
  
  // Send the response back to the client
  server.send(response, 0, response.length, remote.port, remote.address, (err) => {
    if (err) {
      console.error('Failed to send response:', err);
    } else {
      console.log(`Response sent to ${remote.address}:${remote.port}`);
    }
  });
});

// Event handler for errors
server.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

// Bind the server to the specified port and address
server.bind(PORT, HOST);

console.log(`UDP server started. Press Ctrl+C to stop.`);