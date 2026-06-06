package model.frontend;

import java.util.Collections;
import java.util.List;

public class FrontendSearchResponse {
    private List<SearchResultInfo> searchResults = Collections.emptyList();

    public FrontendSearchResponse(List<SearchResultInfo> searchResults) {
        this.searchResults = searchResults;
    }

    public List<SearchResultInfo> getSearchResults() {
        return searchResults;
    }

    public static class SearchResultInfo {
        private String title;
        private String path;
        private int score;

        public SearchResultInfo(String title, String path, int score) {
            this.title = title;
            this.path = path;
            this.score = score;
        }

        public String getTitle() {
            return title;
        }

        public String getPath() {
            return path;
        }

        public int getScore() {
            return score;
        }
    }
}
