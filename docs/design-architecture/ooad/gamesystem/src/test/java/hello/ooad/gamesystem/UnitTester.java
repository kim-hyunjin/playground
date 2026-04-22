package hello.ooad.gamesystem;

public class UnitTester {
    public void testType(Unit unit, String type, String expectedOutputType) {
        System.out.println("\nTesting setting/getting the type property.");
        unit.setType(type);
        String outputType = unit.getType();
        if (expectedOutputType.equals(outputType)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed: " + outputType + " didn't match " + expectedOutputType);
        }
    }

    public void testUnitSpecificProperty(Unit unit, String propertyName, Object inputValue, Object expectedOutputValue) {
        System.out.println("\nTesting setting/getting a unit-specific property.");
        unit.setProperty(propertyName, inputValue);
        try {
            Object outputValue = unit.getProperty(propertyName);
            if (expectedOutputValue.equals(outputValue)) {
                System.out.println("Test passed");
            } else {
                System.out.println("Test failed: " + outputValue + " didn't match " + expectedOutputValue);
            }
        } catch (RuntimeException e) {
            System.out.println("Test failed: " + e.getMessage());
        }
    }

    public void testChangeProperty(Unit unit, String propertyName, Object inputValue, Object expectedOutputValue) {
        System.out.println("\nTesting changing an existing property's value.");
        unit.setProperty(propertyName, inputValue);
        Object outputValue = unit.getProperty(propertyName);
        if (expectedOutputValue.equals(outputValue)) {
            System.out.println("Test passed");
        } else {
            System.out.println("Test failed: " + outputValue + " didn't match " + expectedOutputValue);
        }
    }

    public void testNonExistentProperty(Unit unit, String propertyName) {
        System.out.println("\nTesting getting a non-existent property's value.");
        try {
            Object outputValue = unit.getProperty(propertyName);
        } catch (RuntimeException e) {
            System.out.println("Test passed");
            return;
        }
        System.out.println("Test failed");


    }

    public static void main(String args[]) {
        UnitTester tester = new UnitTester();
        Unit unit = new Unit(1000);
        tester.testType(unit, "infantry", "infantry");
        tester.testUnitSpecificProperty(unit, "hitPoints", 25, 25);
        tester.testChangeProperty(unit, "hitPoints", 15, 15);
        tester.testNonExistentProperty(unit, "strength");
    }
}
