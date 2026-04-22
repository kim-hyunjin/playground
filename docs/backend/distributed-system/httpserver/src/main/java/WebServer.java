import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.concurrent.Executors;

public class WebServer {
    private static final String TASK_ENDPOINT = "/task";
    private static final String STATUS_ENDPOINT = "/status";

    private final int port;
    private HttpServer server;

    public static void main(String[] args) {
        int serverPort = 8080;
        if (args.length == 1) {
            serverPort = Integer.parseInt(args[0]);
        }

        WebServer webServer = new WebServer(serverPort);
        webServer.startServer();

        System.out.println("Server is listening on port " + serverPort);
    }

    public WebServer(int port) {
        this.port = port;
    }

    public void startServer() {
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        HttpContext statusContext = server.createContext(STATUS_ENDPOINT);
        HttpContext taskContext = server.createContext(TASK_ENDPOINT);

        statusContext.setHandler(this::handleStatusCheckRequest);
        taskContext.setHandler(this::handleTaskRequest);

        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();
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
            if (headers.containsKey("X-Test") && headers.get("X-Test").getFirst().equalsIgnoreCase("true")) {
                String dummyResponse = "123\n";
                sendResponse(dummyResponse.getBytes(), exchange);
                return;
            }

            boolean isDebugMode = headers.containsKey("X-Debug") && headers.get("X-Debug").getFirst().equalsIgnoreCase("true");

            long startTime = System.nanoTime();

            byte[] requestBytes = exchange.getRequestBody().readAllBytes();
            byte[] responseBytes = calculateResponse(requestBytes);

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

    private byte[] calculateResponse(byte[] requestBytes) {
        String bodyString = new String(requestBytes);
        String[] stringNumbers = bodyString.split(",");

        BigInteger result = BigInteger.ONE;

        for (String number : stringNumbers) {
            BigInteger bigInteger = new BigInteger(number.trim());
            result = result.multiply(bigInteger);
        }

        return String.format("Result of the multiplication is %s\n", result).getBytes();
    }

    private void sendResponse(byte[] responseBytes, HttpExchange exchange) throws IOException {
        exchange.sendResponseHeaders(200, responseBytes.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(responseBytes);
        }
    }
}
