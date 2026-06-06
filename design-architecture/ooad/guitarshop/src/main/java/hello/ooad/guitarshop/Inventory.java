package hello.ooad.guitarshop;

import java.util.LinkedList;
import java.util.List;

public class Inventory {

  private List<Instrument> inventory;

  public Inventory() {
    inventory = new LinkedList<>();
  }

  public void addInstrument(String serialNumber, double price, InstrumentSpec spec) {

    Instrument instrument = new Instrument(serialNumber, price, spec);
    inventory.add(instrument);

  }

  public Instrument get(String serialNumber) {
    return inventory.stream()
        .filter(instrument -> instrument.getSerialNumber().equals(serialNumber)).findFirst().get();
  }

  public List<Instrument> search(InstrumentSpec searchInstrument) {
    List<Instrument> matchingInstruments = new LinkedList<>();
    for (Instrument instrument : inventory) {
      if (instrument.getSpec().matches(searchInstrument)) {
        matchingInstruments.add(instrument);
      }
    }
    return matchingInstruments;
  }
}
