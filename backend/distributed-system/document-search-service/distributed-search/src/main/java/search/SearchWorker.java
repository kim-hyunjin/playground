package search;

import model.*;
import networking.RequestHandler;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class SearchWorker implements RequestHandler {
    @Override
    public byte[] handleRequest(byte[] request) {
        Task task = (Task) SerializationUtils.deserialize(request);
        List<Document> documents = Objects.requireNonNull(task).getDocuments();
        System.out.printf("Received %d documents to process%n", documents.size());

        DocumentTFMap result = new DocumentTFMap();

        for (Document document : documents) {
            List<String> words = parseWordsFromDocument(document);
            TFMap documentData = TFIDFCalculator.getTFMap(words, task.getSearchTerms());
            result.putDocumentTFMap(document, documentData);
        }

        return SerializationUtils.serialize(result);
    }

    @Override
    public String getEndpoint() {
        return "/task";
    }

    private List<String> parseWordsFromDocument(Document document) {
        try {
            FileReader fileReader = new FileReader(document.getPath());
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            List<String> lines = bufferedReader.lines().toList();
            return TFIDFCalculator.getWordsFromLines(lines);
        } catch (FileNotFoundException e) {
            return Collections.emptyList();
        }
    }
}
