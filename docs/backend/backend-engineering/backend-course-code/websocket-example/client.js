/**
 * WebSocket Client Example
 * 
 * This client demonstrates how to:
 * - Connect to a WebSocket server
 * - Send messages to the server
 * - Receive and process messages from the server
 * - Handle connection events (open, close, error)
 */

const WebSocket = require('websocket').client;
const readline = require('readline');

// Create a WebSocket client
const client = new WebSocket();
const SERVER_URL = 'ws://localhost:8080';

// Set up readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle connection failures
client.on('connectFailed', (error) => {
  console.error(`Connection failed: ${error.toString()}`);
  process.exit(1);
});

// Handle successful connections
client.on('connect', (connection) => {
  console.log('Connected to WebSocket server');
  
  // Handle connection errors
  connection.on('error', (error) => {
    console.error(`Connection error: ${error.toString()}`);
  });
  
  // Handle connection close
  connection.on('close', () => {
    console.log('Connection closed');
    process.exit(0);
  });
  
  // Handle incoming messages
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      try {
        // Parse the JSON message
        const parsedMessage = JSON.parse(message.utf8Data);
        
        // Format and display the message based on its type
        if (parsedMessage.type === 'message') {
          console.log(`\n[${new Date(parsedMessage.timestamp).toLocaleTimeString()}] ${parsedMessage.userId}: ${parsedMessage.content}`);
        } else if (parsedMessage.type === 'system') {
          console.log(`\n[SYSTEM] ${parsedMessage.content}`);
        }
        
        // Re-display the prompt
        rl.prompt();
      } catch (error) {
        console.error(`Error parsing message: ${error.message}`);
        console.log(`Raw message: ${message.utf8Data}`);
      }
    }
  });
  
  // Function to send a message to the server
  function sendMessage(message) {
    if (connection.connected) {
      connection.sendUTF(message);
    } else {
      console.log('Not connected to the server');
    }
  }
  
  // Set up the readline prompt
  rl.setPrompt('Enter message (or "exit" to quit): ');
  rl.prompt();
  
  // Handle user input
  rl.on('line', (line) => {
    if (line.toLowerCase() === 'exit') {
      console.log('Closing connection...');
      connection.close();
      rl.close();
      return;
    }
    
    // Send the message to the server
    sendMessage(line);
    rl.prompt();
  });
  
  // Handle CTRL+C
  rl.on('SIGINT', () => {
    console.log('\nClosing connection...');
    connection.close();
    rl.close();
  });
});

// Connect to the WebSocket server
console.log(`Connecting to ${SERVER_URL}...`);
client.connect(SERVER_URL);

// Display usage instructions
console.log('WebSocket Client');
console.log('----------------');
console.log('Type your message and press Enter to send');
console.log('Type "exit" to quit');
console.log('Press Ctrl+C to quit');