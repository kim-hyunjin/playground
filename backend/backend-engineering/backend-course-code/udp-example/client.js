/**
 * UDP Client Example
 * 
 * This example demonstrates how to create a UDP client in Node.js using the 'dgram' module.
 * The client sends messages to a UDP server and receives responses.
 * 
 * UDP (User Datagram Protocol) characteristics:
 * - Connectionless: No handshake required before sending data
 * - Unreliable: No guarantee of delivery, ordering, or duplicate protection
 * - Fast: Lower overhead than TCP
 * - Suitable for: Real-time applications, gaming, streaming, etc.
 */

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// Define the server details
const SERVER_PORT = 41234;
const SERVER_HOST = '127.0.0.1';

// Message to send to the server
const message = Buffer.from('Hello UDP Server! Message sent at: ' + new Date().toISOString());

// Event handler for when the client receives a message (response from server)
client.on('message', (msg, rinfo) => {
  console.log(`Response from server ${rinfo.address}:${rinfo.port}: ${msg}`);
  
  // Close the client after receiving the response
  console.log('Closing client...');
  client.close();
});

// Event handler for errors
client.on('error', (err) => {
  console.error(`Client error:\n${err.stack}`);
  client.close();
});

// Send the message to the server
client.send(message, 0, message.length, SERVER_PORT, SERVER_HOST, (err) => {
  if (err) {
    console.error('Failed to send message:', err);
    client.close();
  } else {
    console.log(`Message sent to ${SERVER_HOST}:${SERVER_PORT}`);
  }
});

console.log('UDP client started. Will automatically close after receiving response.');

// Example of sending multiple messages (uncomment to use)
/*
// Send a new message every second
const interval = setInterval(() => {
  const newMessage = Buffer.from('Periodic message sent at: ' + new Date().toISOString());
  
  client.send(newMessage, 0, newMessage.length, SERVER_PORT, SERVER_HOST, (err) => {
    if (err) {
      console.error('Failed to send message:', err);
    } else {
      console.log(`Message sent to ${SERVER_HOST}:${SERVER_PORT}`);
    }
  });
}, 1000);

// Stop sending messages after 10 seconds
setTimeout(() => {
  clearInterval(interval);
  console.log('Stopping periodic messages...');
  
  // Close the client after a short delay to allow for final responses
  setTimeout(() => {
    client.close();
    console.log('Client closed.');
  }, 1000);
}, 10000);
*/