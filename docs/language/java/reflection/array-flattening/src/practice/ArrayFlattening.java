package practice;

import java.util.*;
import java.lang.reflect.*;

public class ArrayFlattening {

    public static void main(String[] args) {
        ArrayFlattening arrayFlattening = new ArrayFlattening();
        String[] result = arrayFlattening.concat(String.class, new String[] { "Hello", "World" },
                new String[] { "Java", "Reflection" });
        System.out.println(Arrays.toString(result));
    }

    public <T> T concat(Class<?> type, Object... arguments) {
        if (arguments.length == 0) {
            return null;
        }

        List<Object> elements = new ArrayList<>();
        for (Object argument : arguments) {
            if (argument.getClass().isArray()) {
                int length = Array.getLength(argument);

                for (int i = 0; i < length; i++) {
                    elements.add(Array.get(argument, i));
                }
            } else {
                elements.add(argument);
            }
        }

        Object flattenedArray = Array.newInstance(type, elements.size());

        for (int i = 0; i < elements.size(); i++) {
            Array.set(flattenedArray, i, elements.get(i));
        }

        return (T) flattenedArray;
    }

    public <T> T concat2(Class<?> type, Object... arguments) {

        if (arguments.length == 0) {
            return null;
        }

        int totalLength = 0;
        for (Object arg : arguments) {
            if (arg.getClass().isArray()) {
                totalLength += Array.getLength(arg);
            } else {
                totalLength++;
            }
        }

        Object newArray = Array.newInstance(type, totalLength);
        int i = 0;
        for (Object arg : arguments) {
            if (arg.getClass().isArray()) {
                int length = Array.getLength(arg);
                for (int j = 0; j < length; j++) {
                    Array.set(newArray, i++, Array.get(arg, j));
                }
            } else {
                Array.set(newArray, i++, arg);
            }
        }

        return (T) newArray;
    }
}