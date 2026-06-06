package networking;

public interface RequestHandler {
    byte[] handleRequest(byte[] request);

    String getEndpoint();
}
