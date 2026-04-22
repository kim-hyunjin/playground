import model.TFMap;
import search.TFIDFCalculator;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 도서 파일들에 대해 TF-IDF 점수를 계산하여 가장 관련성 높은 문서를 찾는 메인 클래스
 */
public class SequentialSearch {
    public static final String BOOKS_DIRECTORY = "src/main/resources/books";
    public static final String SEARCH_QUERY_1 = "The best detective that catchs many criminals using his deductive methods";
    public static final String SEARCH_QUERY_2 = "The girl that falls through a rabbit hole into a fantasy wonderland";
    public static final String SEARCH_QUERY_3 = "A war between Russia and France in the cold winter";


    public static void main(String[] args) throws FileNotFoundException {
        File documentsDirectory = new File(BOOKS_DIRECTORY);
        String[] fileNames = documentsDirectory.list();

        if (fileNames == null) {
            System.err.println("책 디렉토리를 찾을 수 없습니다: " + BOOKS_DIRECTORY);
            return;
        }

        List<String> documentNames = Arrays.asList(fileNames);

        List<String> quries = Arrays.asList(SEARCH_QUERY_1, SEARCH_QUERY_2, SEARCH_QUERY_3);
        for (String query : quries) {
            System.out.println("# Query: " + query);
            Map<Double, List<String>> scoreToDocumentsMap = findMostRelevantDocuments(documentNames, query);
            printResults(scoreToDocumentsMap);
        }
    }

    private static Map<Double, List<String>> findMostRelevantDocuments(List<String> documentNames, String query) throws FileNotFoundException {
        Map<String, TFMap> documentToTFMap = new HashMap<>();

        for (String documentName : documentNames) {
            String fullPath = BOOKS_DIRECTORY + "/" + documentName;
            BufferedReader reader = new BufferedReader(new FileReader(fullPath));
            
            List<String> lines = reader.lines().toList();
            List<String> allWordsInDocument = TFIDFCalculator.getWordsFromLines(lines);

            TFMap tfMap = TFIDFCalculator.getTFMap(allWordsInDocument, query);
            documentToTFMap.put(documentName, tfMap);
        }

        // 결과 정렬 시에도 query 문자열 전달
        Map<Double, List<String>> scoreToDocumentsMap = TFIDFCalculator.getDocumentsSortedByScore(query, documentToTFMap);
        
        return scoreToDocumentsMap;
    }

    private static void printResults(Map<Double, List<String>> scoreToDocumentsMap) {
        System.out.println("--- 검색 결과 (TF-IDF 점수 기준) ---");
        for (Map.Entry<Double, List<String>> entry : scoreToDocumentsMap.entrySet()) {
            double score = entry.getKey();
            List<String> documentNames = entry.getValue();

            for (String documentName : documentNames) {
                System.out.printf("도서: %s - 연관도 점수: %f%n", documentName, score);
            }
        }
        System.out.println("--------------------------------");
    }
}
