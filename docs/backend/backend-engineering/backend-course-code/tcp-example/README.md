# TCP Server and Client Example

This example demonstrates how to create a simple TCP server and client in Node.js using the built-in `net` module.

## What is TCP?

TCP (Transmission Control Protocol) is a connection-oriented protocol that provides reliable, ordered, and error-checked delivery of data between applications running on hosts communicating over an IP network.

### Key characteristics of TCP:

- **Connection-oriented**: Requires a handshake before data exchange
- **Reliable**: Guarantees delivery of data packets
- **Ordered**: Data packets are delivered in the same order they were sent
- **Error-checked**: Includes mechanisms to verify data integrity
- **Flow control**: Prevents overwhelming receivers with too much data
- **Congestion control**: Adapts to network congestion

## Files in this Example

- `server.js`: Implements a TCP server that listens for connections and responds to client messages
- `client.js`: Implements a TCP client that connects to the server and sends messages
- `package.json`: Contains project metadata and scripts to run the server and client

## How to Run the Example

### Starting the Server

```bash
# Navigate to the tcp-example directory
cd tcp-example

# Start the server
npm start
# or
node server.js
```

The server will start listening on port 3000 and will display a message when it's ready.

### Running the Client

```bash
# In a new terminal, navigate to the tcp-example directory
cd tcp-example

# Start the client
npm run client
# or
node client.js
```

The client will connect to the server and prompt you to enter messages. Type a message and press Enter to send it to the server. The server will echo back your message.

To exit the client, type `exit` and press Enter.

## How It Works

1. The server creates a TCP socket and listens for connections on port 3000
2. The client creates a TCP socket and connects to the server
3. When a client connects, the server sends a welcome message
4. The client can send messages to the server
5. The server receives the messages, processes them, and sends responses back to the client
6. The client displays the server's responses

## Differences from UDP

Unlike UDP (User Datagram Protocol), TCP:

- Establishes a connection before sending data
- Guarantees delivery and order of messages
- Has more overhead due to connection management and reliability features
- Is better suited for applications where reliability is more important than speed

## Use Cases for TCP

TCP is commonly used for:

- Web browsing (HTTP/HTTPS)
- Email (SMTP, IMAP, POP3)
- File transfers (FTP, SFTP)
- Remote terminal access (SSH)
- Database connections
- Any application requiring reliable data transfer