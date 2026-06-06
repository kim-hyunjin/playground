package model;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class DocumentTFMap implements Serializable {
    private final Map<Document, TFMap> documentToTFMap = new HashMap<>();

    public void putDocumentTFMap(Document documentName, TFMap tfMap) {
        documentToTFMap.put(documentName, tfMap);
    }

    public Map<Document, TFMap> getDocumentToTFMap() {
        return Collections.unmodifiableMap(documentToTFMap);
    }
}
