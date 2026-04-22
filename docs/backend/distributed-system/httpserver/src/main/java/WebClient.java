import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class WebClient {
    private final HttpClient client;

    public WebClient() {
        this.client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build();
    }

    public CompletableFuture<String> sendTask(String url, byte[] requestPayload) {
        HttpRequest request = HttpRequest.newBuilder()
                .header("X-Debug", "true")
                .POST(HttpRequest.BodyPublishers.ofByteArray(requestPayload))
                .uri(URI.create(url))
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    System.out.println("status = " + response.statusCode());
                    System.out.println("headers = " + response.headers().map());
                    return response.body();
                });
    }

    public void close() {
        client.close();
    }
}
