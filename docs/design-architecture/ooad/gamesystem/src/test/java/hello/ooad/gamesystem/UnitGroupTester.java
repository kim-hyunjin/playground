package hello.ooad.gamesystem;

import java.util.LinkedList;
import java.util.List;

public class UnitGroupTester {

    private void createUnitGroup(List<Unit> unitList) {
        System.out.println("\nTesting create Unit with UnitList");
        UnitGroup unitGroup = new UnitGroup(unitList);
        if(unitGroup.getUnits().containsAll(unitList)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    private void addUnit(UnitGroup unitGroup, Unit unit) {
        System.out.println("\nTesting add Unit to UnitGroup");
        unitGroup.addUnit(unit);
        if (unitGroup.getUnit(unit.getId()).equals(unit)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    private void getUnit(UnitGroup unitGroup, int id, Unit expectedUnit) {
        System.out.println("\nTesting getting Unit from UnitGroup");
        if (unitGroup.getUnit(id).equals(expectedUnit)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    private void getUnits(UnitGroup unitGroup, List<Unit> expectedUnitList) {
        System.out.println("\nTesting getting Units from UnitGroup");
        if (unitGroup.getUnits().containsAll(expectedUnitList)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    private void removeUnit(UnitGroup unitGroup, int id) {
        System.out.println("\nTesting removing unit from unitGroup with id");
        unitGroup.removeUnit(id);
        if (unitGroup.getUnits().stream().noneMatch(o -> o.getId() == id)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    private void removeUnit(UnitGroup unitGroup, Unit unit) {
        System.out.println("\nTesting removing unit from unitGroup with unit");
        unitGroup.removeUnit(unit);
        if (unitGroup.getUnits().stream().noneMatch(o -> o.getId() == unit.getId())) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed");
        }
    }

    public static void main(String[] args) {
        List<Unit> unitList = new LinkedList<>();
        Unit unit = new Unit(100);
        unitList.add(unit);
        UnitGroup unitGroup = new UnitGroup();
        UnitGroupTester unitGroupTester = new UnitGroupTester();

        unitGroupTester.createUnitGroup(unitList);

        unitGroupTester.addUnit(unitGroup, unit);
        unitGroupTester.getUnit(unitGroup, 100, unit);
        unitGroupTester.getUnits(unitGroup, unitList);

        unitGroupTester.removeUnit(unitGroup, 100);
        unitGroup.addUnit(unit);
        unitGroupTester.removeUnit(unitGroup, unit);
    }
}
