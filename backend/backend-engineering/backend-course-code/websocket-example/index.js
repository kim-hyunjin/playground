/**
 * Enhanced WebSocket Server Example
 * This server demonstrates basic WebSocket functionality including:
 * - Connection management
 * - Broadcasting messages
 * - Error handling
 * - Connection close handling
 */

const http = require("http");
const WebSocketServer = require("websocket").server;
let connections = [];
const PORT = 8080;

// Create a raw HTTP server (this will help us create the TCP connection for the WebSocket)
const httpServer = http.createServer((req, res) => {
    // Return 404 for any HTTP requests as we're only handling WebSocket connections
    res.writeHead(404);
    res.end("This server only supports WebSocket connections");
});

// Pass the httpServer object to the WebSocketServer constructor
const websocket = new WebSocketServer({
    "httpServer": httpServer,
    // You can specify additional options here
    "autoAcceptConnections": false // For security, manually accept connections
});

// Listen on the TCP socket
httpServer.listen(PORT, () => console.log(`WebSocket server is listening on port ${PORT}`));

// Handle WebSocket connection requests
websocket.on("request", request => {
    try {
        // Accept the connection (in a production environment, you should validate the origin)
        const connection = request.accept(null, request.origin);
        console.log(`New connection from ${connection.remoteAddress} (port: ${connection.socket.remotePort})`);
        
        // Generate a unique user identifier
        const userId = `User-${connection.socket.remotePort}`;
        connection.userId = userId; // Store the userId on the connection object
        
        // Handle incoming messages
        connection.on("message", message => {
            try {
                if (message.type === 'utf8') {
                    const messageText = message.utf8Data;
                    console.log(`Received message from ${userId}: ${messageText}`);
                    
                    // Broadcast the message to all connected clients
                    const broadcastMessage = JSON.stringify({
                        type: "message",
                        userId: userId,
                        content: messageText,
                        timestamp: new Date().toISOString()
                    });
                    
                    connections.forEach(client => {
                        if (client.connected) {
                            client.sendUTF(broadcastMessage);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error handling message: ${error.message}`);
            }
        });
        
        // Handle connection close
        connection.on("close", (reasonCode, description) => {
            console.log(`Connection from ${userId} closed (${reasonCode}: ${description})`);
            
            // Remove the connection from our array
            connections = connections.filter(client => client !== connection);
            
            // Notify other clients about the disconnection
            const disconnectMessage = JSON.stringify({
                type: "system",
                content: `${userId} has disconnected`,
                timestamp: new Date().toISOString()
            });
            
            connections.forEach(client => {
                if (client.connected) {
                    client.sendUTF(disconnectMessage);
                }
            });
        });
        
        // Handle connection errors
        connection.on("error", error => {
            console.error(`Connection error for ${userId}: ${error.message}`);
        });
        
        // Add the new connection to our array
        connections.push(connection);
        
        // Notify all clients about the new connection
        const connectMessage = JSON.stringify({
            type: "system",
            content: `${userId} has connected`,
            timestamp: new Date().toISOString()
        });
        
        connections.forEach(client => {
            if (client.connected) {
                client.sendUTF(connectMessage);
            }
        });
        
    } catch (error) {
        console.error(`Error handling connection request: ${error.message}`);
    }
});

// Error handling for the WebSocket server
websocket.on("error", error => {
    console.error(`WebSocket server error: ${error.message}`);
});
