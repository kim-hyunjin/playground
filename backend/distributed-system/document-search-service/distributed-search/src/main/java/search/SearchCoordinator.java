package search;

import cluster.management.ServiceRegistry;
import com.google.protobuf.InvalidProtocolBufferException;
import model.*;
import model.proto.SearchModel;
import networking.RequestHandler;
import networking.WebClient;

import java.io.File;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class SearchCoordinator implements RequestHandler {

    private final ServiceRegistry workersServiceRegistry;
    private final WebClient webClient;
    private final List<Document> documents;
    private static final String BOOKS_DIRECTORY = "src/main/resources/books";


    public SearchCoordinator(ServiceRegistry workersServiceRegistry) {
        this.workersServiceRegistry = workersServiceRegistry;
        this.webClient = new WebClient();
        this.documents = readDocumentsList();
    }

    @Override
    public byte[] handleRequest(byte[] requestPayload) {
        try {
            SearchModel.Request request = SearchModel.Request.parseFrom(requestPayload);
            SearchModel.Response response = createResponse(request);
            return response.toByteArray();
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
            return SearchModel.Response.getDefaultInstance().toByteArray();
        }
    }

    @Override
    public String getEndpoint() {
        return "/search";
    }

    private SearchModel.Response createResponse(SearchModel.Request request) {
        SearchModel.Response.Builder responseBuilder = SearchModel.Response.newBuilder();

        System.out.println("Received search query: " + request.getSearchQuery());

        List<String> searchTerms = TFIDFCalculator.getWordsFromLine(request.getSearchQuery());
        List<String> workers = workersServiceRegistry.getAllServiceAddresses();

        if (workers.isEmpty()) {
            System.out.println("No search workers currently available");
            return responseBuilder.build();
        }

        List<Task> tasks = createTasks(workers.size(), searchTerms);
        List<DocumentTFMap> results = sendTasksToWorkers(workers, tasks);

        List<SearchModel.Response.DocumentStats> sortedDocuments = aggregateResults(results, searchTerms);
        responseBuilder.addAllRelevantDocuments(sortedDocuments);

        return responseBuilder.build();
    }

    private List<SearchModel.Response.DocumentStats> aggregateResults(List<DocumentTFMap> results, List<String> searchTerms) {
        Map<Document, TFMap> allDocumentsResults = new HashMap<>();

        for (DocumentTFMap result : results) {
            allDocumentsResults.putAll(result.getDocumentToTFMap());
        }

        System.out.println("Calculating score for all the documents");
        Map<Double, List<Document>> scoreToDocuments = TFIDFCalculator.getDocumentsSortedByScore(searchTerms, allDocumentsResults);

        List<SearchModel.Response.DocumentStats> sortedDocumentsStatsList = new ArrayList<>();

        for (Map.Entry<Double, List<Document>> docScorePair : scoreToDocuments.entrySet()) {
            double score = docScorePair.getKey();

            for (Document document : docScorePair.getValue()) {

                SearchModel.Response.DocumentStats documentStats = SearchModel.Response.DocumentStats.newBuilder()
                        .setScore(score)
                        .setDocumentName(document.getName())
                        .build();

                sortedDocumentsStatsList.add(documentStats);
            }
        }

        return sortedDocumentsStatsList;
    }

    private List<DocumentTFMap> sendTasksToWorkers(List<String> workers, List<Task> tasks) {
        CompletableFuture<DocumentTFMap>[] futures = new CompletableFuture[workers.size()];
        for (int i = 0; i < workers.size(); i++) {
            String worker = workers.get(i);
            Task task = tasks.get(i);
            byte[] payload = SerializationUtils.serialize(task);

            futures[i] = webClient.sendTask(worker, payload);
        }

        List<DocumentTFMap> results = new ArrayList<>();
        for (CompletableFuture<DocumentTFMap> future : futures) {
            try {
                DocumentTFMap result = future.get();
                results.add(result);
            } catch (InterruptedException | ExecutionException e) {
            }
        }
        System.out.println(String.format("Received %d/%d results", results.size(), tasks.size()));
        return results;
    }

    public List<Task> createTasks(int numberOfWorkers, List<String> searchTerms) {
        List<List<Document>> workersDocuments = splitDocumentList(numberOfWorkers, documents);

        List<Task> tasks = new ArrayList<>();

        for (List<Document> documentsForWorker : workersDocuments) {
            Task task = new Task(searchTerms, documentsForWorker);
            tasks.add(task);
        }

        return tasks;
    }

    private static List<List<Document>> splitDocumentList(int numberOfWorkers, List<Document> documents) {
        // 10 / 3 = 3 이 되어버려 문서 1개 누락됨. 아래와 같이 계산하여 4, 4, 2개씩 워커가 문서를 나눠 가질 수 있도록 함.
        int numberOfDocumentsPerWorker = (documents.size() + numberOfWorkers - 1) / numberOfWorkers;

        List<List<Document>> workersDocuments = new ArrayList<>();

        for (int i = 0; i < numberOfWorkers; i++) {
            int firstDocumentIndex = i * numberOfDocumentsPerWorker;
            int lastDocumentIndexExclusive = Math.min(firstDocumentIndex + numberOfDocumentsPerWorker, documents.size());

            if (firstDocumentIndex >= lastDocumentIndexExclusive) {
                break;
            }
            List<Document> currentWorkerDocuments = new ArrayList<>(documents.subList(firstDocumentIndex, lastDocumentIndexExclusive));

            workersDocuments.add(currentWorkerDocuments);
        }
        return workersDocuments;
    }

    private static List<Document> readDocumentsList() {
        File documentsDirectory = new File(BOOKS_DIRECTORY);
        return Arrays.stream(Objects.requireNonNull(documentsDirectory.list()))
                .map(documentName -> {
                    String documentPath = BOOKS_DIRECTORY + "/" + documentName;
                    File documentFile = new File(documentPath);
                    return Document.builder()
                            .name(documentName)
                            .path(documentPath)
                            .size(documentFile.length())
                            .build();
                })
                .toList();
    }
}
