package hello.ooad.gamesystem;

import java.util.*;

public class UnitGroup {
    private Map<Integer, Unit> units;

    public UnitGroup(List<Unit> unitList) {
        units = new HashMap<>();
        for (Unit unit : unitList) {
            units.put(unit.getId(), unit);
        }
    }

    public UnitGroup() {
        this(new LinkedList<>());
    }

    public void addUnit(Unit unit) {
        units.put(unit.getId(), unit);
    }

    public void removeUnit(int id) {
        units.remove(id);
    }

    public void removeUnit(Unit unit) {
        units.remove(unit.getId());
    }

    public Unit getUnit(int id) {
        return units.get(id);
    }

    public List<Unit> getUnits() {
        List<Unit> unitList = new LinkedList<>();
        for (Map.Entry<Integer, Unit> integerUnitEntry : units.entrySet()) {
            Unit unit = integerUnitEntry.getValue();
            unitList.add(unit);
        }
        return unitList;
    }
}
