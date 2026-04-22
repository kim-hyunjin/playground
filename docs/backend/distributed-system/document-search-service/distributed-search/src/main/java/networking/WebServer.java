package networking;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.concurrent.Executors;

public class WebServer {
    private static final String STATUS_ENDPOINT = "/status";

    protected HttpServer server;

    private RequestHandler requestHandler;

    public WebServer(int port, RequestHandler requestHandler) {
        this.requestHandler = requestHandler;

        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void startServer() {
        HttpContext statusContext = server.createContext(STATUS_ENDPOINT);
        statusContext.setHandler(this::handleStatusCheckRequest);

        HttpContext taskContext = server.createContext(requestHandler.getEndpoint());
        taskContext.setHandler(this::handleTaskRequest);

        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();
    }

    public void stopServer() {
        if (server != null) {
            server.stop(10);
            server = null;
        }
    }

    protected void sendResponse(byte[] responseBytes, HttpExchange exchange) throws IOException {
        exchange.sendResponseHeaders(200, responseBytes.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(responseBytes);
        }
    }

    private void handleStatusCheckRequest(HttpExchange exchange) throws IOException {
        try {
            if (!exchange.getRequestMethod().equalsIgnoreCase("get")) {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            String responseMsg = "Server is alive";
            sendResponse(responseMsg.getBytes(), exchange);
        } finally {
            exchange.close();
        }
    }

    private void handleTaskRequest(HttpExchange exchange) throws IOException {
        try {
            if (!exchange.getRequestMethod().equalsIgnoreCase("post")) {
                drainRequestBody(exchange);
                sendErrorResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            Headers headers = exchange.getRequestHeaders();

            boolean isDebugMode = headers.containsKey("X-Debug") && headers.get("X-Debug").getFirst().equalsIgnoreCase("true");

            long startTime = System.nanoTime();

            byte[] requestBytes = exchange.getRequestBody().readAllBytes();
            byte[] responseBytes = requestHandler.handleRequest(requestBytes);

            long finishTime = System.nanoTime();

            if (isDebugMode) {
                String debugMsg = String.format("Operation took %d ns", finishTime - startTime);
                exchange.getResponseHeaders().put("X-Debug-Info", List.of(debugMsg));
            }

            sendResponse(responseBytes, exchange);
        } finally {
            exchange.close();
        }
    }

    private void drainRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream inputStream = exchange.getRequestBody()) {
            inputStream.readAllBytes();
        }
    }

    private void sendErrorResponse(HttpExchange exchange, int statusCode, String message) throws IOException {
        byte[] responseBytes = message.getBytes();
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(responseBytes);
        }
    }
}
