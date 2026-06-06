# WebSocket Example

This example demonstrates a simple WebSocket implementation with a server and client in Node.js. WebSockets provide a persistent connection between a client and server, allowing for real-time, bidirectional communication.

## Features

- **Real-time Communication**: Messages are instantly delivered to all connected clients
- **Structured Messages**: JSON-formatted messages with timestamps and user identification
- **Connection Management**: Proper handling of connections, disconnections, and errors
- **Interactive Client**: Command-line client with user-friendly interface

## Prerequisites

- Node.js (v12 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository or navigate to this directory
2. Install dependencies:

```bash
npm install
```

## Usage

### Starting the Server

Run the server with:

```bash
node index.js
```

The server will start listening on port 8080. You should see:

```
WebSocket server is listening on port 8080
```

### Starting the Client

In a separate terminal window, run the client with:

```bash
node client.js
```

The client will attempt to connect to the server at `ws://localhost:8080`. If successful, you'll see:

```
Connecting to ws://localhost:8080...
WebSocket Client
----------------
Type your message and press Enter to send
Type "exit" to quit
Press Ctrl+C to quit
Connected to WebSocket server
Enter message (or "exit" to quit):
```

### Using the Client

- Type a message and press Enter to send it to all connected clients
- Type `exit` to close the connection and quit
- Press Ctrl+C to quit at any time

### Multiple Clients

You can start multiple client instances in different terminal windows to simulate multiple users. Each client will receive messages from all other clients.

## How It Works

### Server (index.js)

The server:
1. Creates an HTTP server
2. Sets up a WebSocket server on top of the HTTP server
3. Listens for WebSocket connection requests
4. Maintains a list of all active connections
5. Broadcasts messages to all connected clients
6. Handles connection closures and errors

### Client (client.js)

The client:
1. Connects to the WebSocket server
2. Provides a command-line interface for sending messages
3. Displays incoming messages from the server
4. Handles connection events (open, close, error)

## Message Format

Messages are sent as JSON objects with the following structure:

```json
{
  "type": "message|system",
  "userId": "User-XXXXX",
  "content": "The message content",
  "timestamp": "2025-07-29T12:34:56.789Z"
}
```

- `type`: Either "message" (user message) or "system" (connection/disconnection notifications)
- `userId`: Identifier for the user who sent the message
- `content`: The message content
- `timestamp`: ISO timestamp when the message was sent

## Error Handling

Both the server and client include comprehensive error handling:

- Connection failures
- Message parsing errors
- Connection closures
- Runtime errors

## License

ISC