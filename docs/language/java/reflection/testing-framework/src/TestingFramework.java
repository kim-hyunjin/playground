import java.util.*;
import java.lang.reflect.*;

public class TestingFramework {
    public void runTestSuite(Class<?> testClass) throws Throwable {
        Method[] methods = testClass.getMethods();
        Method beforeClass = findMethodByName(methods, "beforeClass");
        Method afterClass = findMethodByName(methods, "afterClass");
        Method setupTest = findMethodByName(methods, "setupTest");
        List<Method> testMethods = findMethodsByPrefix(methods, "test");

        if (isValidMethod(beforeClass)) {
            beforeClass.invoke(null);
        }
        for (Method test : testMethods) {
            Constructor<?> constructor = testClass.getDeclaredConstructor();
            Object instance = constructor.newInstance();
            if (isValidMethod(setupTest)) {
                setupTest.invoke(instance);
            }
            if (isValidMethod(test)) {
                test.invoke(instance);
            }
        }
        if (isValidMethod(afterClass)) {
            afterClass.invoke(null);
        }

    }

    /**
     * Helper method to find a method by name
     * Returns null if a method with the given name does not exist
     */
    private Method findMethodByName(Method[] methods, String name) {
        for (Method method : methods) {
            if (method.getName().equals(name)) {
                return method;
            }
        }
        return null;
    }

    /**
     * Helper method to find all the methods that start with the given prefix
     */
    private List<Method> findMethodsByPrefix(Method[] methods, String prefix) {
        List<Method> testMethods = new ArrayList<>();
        for (Method method : methods) {
            if(method.getName().startsWith(prefix)) {
                testMethods.add(method);
            }
        }
        return testMethods;
    }

    private boolean isValidMethod(Method method) {
        return method != null && method.getReturnType().equals(void.class) && method.getParameterCount() == 0;
    }
}