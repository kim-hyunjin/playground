package hello.ooad.guitarshop;

import java.util.HashMap;
import java.util.Map;

public class InstrumentSpec {
  public Map<String, Object> properties;

  public InstrumentSpec(Map<String, Object> properties) {
    if (properties == null) {
      this.properties = new HashMap<>();
    } else {
      this.properties = new HashMap<>(properties);
    }
  }

  public boolean matches(InstrumentSpec otherSpec) {
    for (String propertyName : otherSpec.getProperties().keySet()) {
      if (!properties.get(propertyName).equals(otherSpec.getProperty(propertyName))) {
        return false;
      }
    }
    return true;
  }

  public Object getProperty(String propertyName) {
    return properties.get(propertyName);
  }

  public Map<String, Object> getProperties() {
    return properties;
  }


}
