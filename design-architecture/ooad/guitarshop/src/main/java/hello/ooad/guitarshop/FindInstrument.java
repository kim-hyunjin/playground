package hello.ooad.guitarshop;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



public class FindInstrument {

  public static void main(String[] args) {
    Inventory inventory = new Inventory();
    initializeInventory(inventory);

    Map<String, Object> property = new HashMap<>();
    property.put("builder", Builder.GIBSON);
    property.put("backWood", Wood.MAPLE);
    InstrumentSpec whatEricLikes = new InstrumentSpec(property);

    List<Instrument> matchingInstruments = inventory.search(whatEricLikes);
    if (!matchingInstruments.isEmpty()) {
      System.out.println("You might like these instruments:");
      for (Instrument instrument : matchingInstruments) {
        InstrumentSpec spec = instrument.getSpec();
        System.out.println(
            "We have a " + spec.getProperty("instrumentType") + " with the follwing properties:");
        for (String propertyName : spec.getProperties().keySet()) {
          if ("instrumentType".equals(propertyName)) {
            continue;
          }
          System.out.println("    " + propertyName + ": " + spec.getProperty(propertyName));
        }
        System.out.println("  You can have this " + spec.getProperty("instrumentType") + " for $"
            + instrument.getPrice() + "\n---");
      }
    } else {
      System.out.println("Sorry, we have nothing for you.");
    }


  }

  private static void initializeInventory(Inventory inventory) {
    Map<String, Object> property = new HashMap<>();
    property.put("instrumentType", InstrumentType.GUITAR);
    property.put("builder", Builder.COLLINGS);
    property.put("model", "CJ");
    property.put("type", Type.ACOUSTIC);
    property.put("numStrings", 6);
    property.put("topWood", Wood.INDIAN_ROSEWOOD);
    property.put("backWood", Wood.SITKA);
    inventory.addInstrument("11277", 3999.95, new InstrumentSpec(property));

    property.put("builder", Builder.MARTIN);
    property.put("model", "D-18");
    property.put("topWood", Wood.MAHOGANY);
    property.put("backWood", Wood.ADIRONDACK);
    inventory.addInstrument("122784", 5495.95, new InstrumentSpec(property));

    property.put("builder", Builder.FENDER);
    property.put("model", "Stratocastor");
    property.put("topWood", Wood.ALDER);
    property.put("backWood", Wood.ALDER);
    // 기타들을 재고 목록에 등록
    inventory.addInstrument("V95693", 1499.95, new InstrumentSpec(property));
    inventory.addInstrument("V9512", 1549.95, new InstrumentSpec(property));

    property.put("builder", Builder.GIBSON);
    property.put("model", "Les Paul");
    property.put("topWood", Wood.MAPLE);
    property.put("backWood", Wood.MAPLE);
    inventory.addInstrument("70108276", 2295.95, new InstrumentSpec(property));
    property.put("model", "SG `61 Reissue");
    property.put("topWood", Wood.MAHOGANY);
    property.put("backWood", Wood.MAHOGANY);
    inventory.addInstrument("82765501", 1890.95, new InstrumentSpec(property));

    property.put("instrumentType", InstrumentType.MANDOLIN);
    property.put("model", "F-5G");
    property.put("type", Type.ACOUSTIC);
    property.put("topWood", Wood.MAPLE);
    property.put("backWood", Wood.MAPLE);
    property.remove("numStrings");
    inventory.addInstrument("9019920", 5495.95, new InstrumentSpec(property));

    property.put("instrumentType", InstrumentType.BANJO);
    property.put("model", "RG-3 Wreath");
    property.remove("topWood");
    property.put("numStrings", 5);
    inventory.addInstrument("8900231", 2945.95, new InstrumentSpec(property));

  }
}
