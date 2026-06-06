package search;

import model.IDFMap;
import model.TFMap;

import java.util.*;

/**
 * TF-IDF(Term Frequency - Inverse Document Frequency) 알고리즘을 사용하여
 * 문서의 중요도와 검색어의 연관성을 계산하는 클래스
 */
public class TFIDFCalculator {

    /**
     * 문서의 전체 본문 내용과 검색 쿼리(String)를 받아 TF를 계산합니다.
     * @param allWordsInDocument 문서의 전체 단어 리스트
     * @param query 검색 쿼리
     * @return 검색 쿼리의 단어와 해당 단어의 TF를 매핑한 맵
     */
    public static TFMap getTFMap(List<String> allWordsInDocument, String query) {
        TFMap tfMap = new TFMap();
        List<String> searchTerms = getWordsFromLine(query);

        for (String term : searchTerms) {
            double termFrequency = calculateTermFrequency(allWordsInDocument, term);
            tfMap.putTermFrequency(term, termFrequency);
        }
        return tfMap;
    }

    /**
     * 검색 쿼리와 각 문서에 계산된 tf를 바탕으로 각 문서의 최종 점수를 계산하여 내림차순으로 정렬된 맵을 반환합니다.
     * @param query 검색 쿼리
     * @param documentToTFMap 문서 이름과 해당 문서의 TF 맵을 매핑한 맵
     * @return 스코어를 키로, 해당 스코어에 해당하는 문서 이름 리스트를 값으로 가지는 맵
     */
    public static Map<Double, List<String>> getDocumentsSortedByScore(String query, Map<String, TFMap> documentToTFMap) {
        TreeMap<Double, List<String>> scoreToDocuments = new TreeMap<>();
        List<String> searchTerms = getWordsFromLine(query);

        IDFMap idfMap = new IDFMap();
        for (String term : searchTerms) {
            double idf = calculateInverseDocumentFrequency(term, documentToTFMap);
            idfMap.putTermIDF(term, idf);
        }

        for (String documentName : documentToTFMap.keySet()) {
            TFMap tfMap = documentToTFMap.get(documentName);
            double score = calculateDocumentScore(searchTerms, tfMap, idfMap);

            scoreToDocuments.computeIfAbsent(score, k -> new ArrayList<>()).add(documentName);
        }

        return scoreToDocuments.descendingMap();
    }

    /**
     * 문서 전체 줄 리스트에서 모든 단어를 추출합니다.
     */
    public static List<String> getWordsFromLines(List<String> lines) {
        List<String> words = new ArrayList<>();
        for (String line : lines) {
            words.addAll(getWordsFromLine(line));
        }
        return words;
    }

    /**
     * 특정 단어가 한 문서 내에서 나타나는 빈도(TF)를 계산합니다.
     */
    private static double calculateTermFrequency(List<String> allWordsInDocument, String term) {
        long count = 0;
        for (String word : allWordsInDocument) {
            if (word.equalsIgnoreCase(term)) {
                count++;
            }
        }
        return (double) count / allWordsInDocument.size();
    }

    /**
     * 단어의 역문서 빈도(IDF)를 계산합니다.
     */
    private static double calculateInverseDocumentFrequency(String term, Map<String, TFMap> documentToTFMap) {
        double documentsWithTermCount = 0;
        for (TFMap tfMap : documentToTFMap.values()) {
            if (tfMap.getTermFrequency(term) > 0) {
                documentsWithTermCount++;
            }
        }
        return documentsWithTermCount == 0 ? 0 : Math.log10((double) documentToTFMap.size() / documentsWithTermCount);
    }

    /**
     * 개별 문서의 최종 TF-IDF 점수를 합산하여 계산합니다.
     */
    private static double calculateDocumentScore(List<String> searchTerms, TFMap tfMap, IDFMap idfMap) {
        double totalScore = 0;
        for (String term : searchTerms) {
            double tf = tfMap.getTermFrequency(term);
            double idf = idfMap.getTermIDF(term);
            totalScore += tf * idf;
        }
        return totalScore;
    }

    /**
     * 특정 줄에서 단어들을 추출하여 리스트로 반환합니다.
     */
    private static List<String> getWordsFromLine(String line) {
        return Arrays.asList(line.split("(\\.)+|(,)+|( )+|(-)+|(\\?)+|(!)+|(;)+|(:)+|(\\d)+|(\\n)+"));
    }
}
