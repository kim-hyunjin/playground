/**
 * TCP Client Example
 * 
 * This example demonstrates how to create a TCP client in Node.js using the 'net' module.
 * The client connects to a TCP server, sends messages, and receives responses.
 * 
 * TCP (Transmission Control Protocol) characteristics:
 * - Connection-oriented: Requires a handshake before data exchange
 * - Reliable: Guarantees delivery, ordering, and duplicate protection
 * - Flow control: Prevents overwhelming receivers with too much data
 * - Congestion control: Adapts to network congestion
 * - Suitable for: Web browsing, email, file transfers, and any application requiring reliable data transfer
 */

const net = require('net');
const readline = require('readline');

// Define the server details
const SERVER_PORT = 3000;
const SERVER_HOST = '127.0.0.1';

// Create a TCP socket
const client = new net.Socket();

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to the server
client.connect(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Connected to server at ${SERVER_HOST}:${SERVER_PORT}`);
  
  // Prompt user for input after connection is established
  promptUser();
});

// Set encoding for the socket
client.setEncoding('utf8');

// Event handler for when data is received from the server
client.on('data', (data) => {
  console.log(`Server response: ${data}`);
  
  // Prompt for next message
  promptUser();
});

// Event handler for when the server closes the connection
client.on('close', () => {
  console.log('Connection closed');
  rl.close();
});

// Event handler for errors
client.on('error', (err) => {
  console.error(`Client error:\n${err.stack}`);
  client.destroy(); // Close the socket
  rl.close();
});

// Function to prompt user for input
function promptUser() {
  rl.question('Enter message (or "exit" to quit): ', (message) => {
    if (message.toLowerCase() === 'exit') {
      console.log('Closing connection...');
      client.end();
      rl.close();
    } else {
      // Send the message to the server
      client.write(message);
    }
  });
}

// Event handler for when readline interface is closed
rl.on('close', () => {
  console.log('TCP client terminated');
  process.exit(0);
});