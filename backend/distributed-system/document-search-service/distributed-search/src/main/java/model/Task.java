package model;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

public class Task implements Serializable {
    private final List<String> searchTerms;
    private final List<Document> documents;

    public Task(List<String> searchTerms, List<Document> documents) {
        this.searchTerms = searchTerms;
        this.documents = documents;
    }

    public List<String> getSearchTerms() {
        return Collections.unmodifiableList(searchTerms);
    }

    public List<Document> getDocuments() {
        return Collections.unmodifiableList(documents);
    }
}