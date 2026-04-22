package model;

import java.util.HashMap;
import java.util.Map;

/**
 * IDFMap은 단어와 해당 단어의 역문서 빈도(IDF)를 저장하는 클래스입니다.
 */
public class IDFMap {
    private final Map<String, Double> termToIDFMap = new HashMap<>();

    public void putTermIDF(String term, double frequency) {
        termToIDFMap.put(term, frequency);
    }

    public double getTermIDF(String term) {
        return termToIDFMap.getOrDefault(term, 0.0);
    }
}
