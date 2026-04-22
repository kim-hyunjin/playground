package model;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 특정 문서 내의 단어 빈도수(Term Frequency) 정보를 저장하는 클래스
 */
public class TFMap implements Serializable {
    // 단어(Term)와 해당 단어가 문서 내에서 차지하는 빈도율(Frequency)을 매핑
    private final Map<String, Double> termToFrequencyMap = new HashMap<>();

    public void putTermFrequency(String term, double frequency) {
        termToFrequencyMap.put(term, frequency);
    }

    public double getTermFrequency(String term) {
        return termToFrequencyMap.getOrDefault(term, 0.0);
    }
}
