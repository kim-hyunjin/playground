/*
 *  MIT License
 *
 *  Copyright (c) 2020 Michael Pogrebinsky - Java Reflection - Master Class
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

package jsonwriter;

import data.Actor;
import data.Address;
import data.Company;
import data.Movie;
import data.Person;

import java.lang.reflect.Array;
import java.lang.reflect.Field;

/**
 * Json Writer
 * https://www.udemy.com/course/java-reflection-master-class
 */
public class Main {
    public static void main(String[] args) throws IllegalAccessException {
        Company company = new Company("Udemy", "San Francisco", new Address("Harrison Street", (short) 600));
        Address address = new Address("Main Street", (short) 1);
        Person person = new Person("John", true, 29, 100.555f, address, company);

        String json = objectToJson(person, 0);

        System.out.println(json);

        Actor actor1 = new Actor("Elijah Wood", new String[] { "The Lord of the Rings", "The Hobbit" });
        Actor actor2 = new Actor("Ian McKellen", new String[] { "The Lord of the Rings", "The Hobbit" });
        Movie movie = new Movie("The Lord of the Rings", 9.0f, new String[] { "Adventure", "Fantasy" },
                new Actor[] { actor1, actor2 });

        String jsonMovie = objectToJson(movie, 0);
        System.out.println(jsonMovie);
    }

    public static String objectToJson(Object instance, int indentSize) throws IllegalAccessException {
        Field[] fields = instance.getClass().getDeclaredFields();
        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append("{");
        stringBuilder.append("\n");

        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            field.setAccessible(true);

            if (field.isSynthetic()) {
                continue;
            }

            stringBuilder.append(indent(indentSize + 1));
            stringBuilder.append(formatStringValue(field.getName()));

            stringBuilder.append(":");

            if (field.getType().isPrimitive()) {
                stringBuilder.append(formatPrimitiveValue(field.get(instance), field.getType()));
            } else if (field.getType().equals(String.class)) {
                stringBuilder.append(formatStringValue(field.get(instance).toString()));
            } else if (field.getType().isArray()) {
                stringBuilder.append(formatArrayValue(field.get(instance), indentSize + 1));
            } else {
                stringBuilder.append(objectToJson(field.get(instance), indentSize + 1));
            }

            if (i != fields.length - 1) {
                stringBuilder.append(",");
            }
            stringBuilder.append("\n");
        }

        stringBuilder.append(indent(indentSize));
        stringBuilder.append("}");
        return stringBuilder.toString();
    }

    private static String indent(int indentSize) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < indentSize; i++) {
            stringBuilder.append("\t");
        }
        return stringBuilder.toString();
    }

    private static String formatPrimitiveValue(Object instance, Class<?> type) throws IllegalAccessException {
        if (type.equals(boolean.class)
                || type.equals(int.class)
                || type.equals(long.class)
                || type.equals(short.class)) {
            return instance.toString();
        } else if (type.equals(double.class) || type.equals(float.class)) {
            return String.format("%.02f", instance);
        }

        throw new RuntimeException(String.format("Type : %s is unsupported", type.getTypeName()));
    }

    private static String formatStringValue(String value) {
        return String.format("\"%s\"", value);
    }

    private static String formatArrayValue(Object instance, int indentSize) throws IllegalAccessException {
        Class<?> arrayComponentType = instance.getClass().getComponentType();

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("[");
        stringBuilder.append("\n");

        for (int i = 0; i < Array.getLength(instance); i++) {
            Object element = Array.get(instance, i);

            stringBuilder.append(indent(indentSize + 1));
            if (arrayComponentType.isPrimitive()) {
                stringBuilder.append(formatPrimitiveValue(element, arrayComponentType));
            } else if (arrayComponentType.equals(String.class)) {
                stringBuilder.append(formatStringValue(element.toString()));
            } else {
                stringBuilder.append(objectToJson(element, indentSize + 1));
            }

            if (i != Array.getLength(instance) - 1) {
                stringBuilder.append(",");
            }
            stringBuilder.append("\n");
        }

        stringBuilder.append(indent(indentSize));
        stringBuilder.append("]");
        return stringBuilder.toString();
    }
}
