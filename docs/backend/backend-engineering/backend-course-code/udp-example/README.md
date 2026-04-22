# UDP Communication Example with Node.js

This example demonstrates how to implement UDP (User Datagram Protocol) communication in Node.js using the built-in `dgram` module.

## What is UDP?

UDP (User Datagram Protocol) is a connectionless transport protocol with the following characteristics:

- **Connectionless**: No handshake required before sending data
- **Unreliable**: No guarantee of delivery, ordering, or duplicate protection
- **Fast**: Lower overhead than TCP
- **Suitable for**: Real-time applications, gaming, streaming, VoIP, etc.

## When to Use UDP

UDP is ideal for applications where:
- Speed is more important than reliability
- Small data loss is acceptable
- Low latency is critical
- Broadcasting or multicasting is needed

## Project Structure

- `server.js`: UDP server implementation
- `client.js`: UDP client implementation
- `package.json`: Project configuration

## How to Run the Example

### Prerequisites

- Node.js installed on your machine

### Running the Server

Open a terminal window and run:

```bash
cd udp-example
node server.js
```

The server will start and listen for incoming UDP messages on port 41234.

### Running the Client

Open a new terminal window and run:

```bash
cd udp-example
node client.js
```

The client will send a message to the server and display the response.

## Expected Output

### Server Terminal

```
UDP server started. Press Ctrl+C to stop.
UDP Server listening on 127.0.0.1:41234
Message from 127.0.0.1:XXXXX: Hello UDP Server! Message sent at: YYYY-MM-DDTHH:MM:SS.sssZ
Response sent to 127.0.0.1:XXXXX
```

### Client Terminal

```
UDP client started. Will automatically close after receiving response.
Message sent to 127.0.0.1:41234
Response from server 127.0.0.1:41234: Server received: Hello UDP Server! Message sent at: YYYY-MM-DDTHH:MM:SS.sssZ
Closing client...
```

## Advanced Usage

The client file includes a commented section that demonstrates how to send periodic messages to the server. To use this feature:

1. Open `client.js`
2. Uncomment the code block at the bottom of the file
3. Run the client as described above

This will send a new message to the server every second for 10 seconds.

## Key Concepts Demonstrated

1. Creating UDP sockets
2. Sending and receiving datagrams
3. Handling UDP events
4. Error handling in UDP communication

## Limitations of UDP

- No guarantee of delivery
- No guarantee of order
- No built-in congestion control
- No connection state tracking

For applications requiring reliable communication, consider using TCP instead.