import java.util.HashMap;
import java.util.Map;

public class Main {

    public static void main(String[] args) throws ClassNotFoundException {

        Class<?> intClass = int.class;
        Class<String> stringClass = String.class;
        Class<?> stringArrayClass = String[].class;

        Map<String, Integer> mapObject = new HashMap<>();
        Class<?> hashMapClass = mapObject.getClass();

        Class<?> squaresClass = Class.forName("Main$Square");

        Class<?> colorClass = Color.class;

        var circleObject = new Drawable() {
            @Override
            public int getNumberOfCorners() {
                return 0;
            }
        };

        Class<?> drawableClass = Drawable.class;

        printClassInfo(intClass, stringClass, stringArrayClass, hashMapClass, squaresClass, colorClass, circleObject.getClass(), drawableClass);
    }

    private static void printClassInfo(Class<?>... classes) {
        for (Class<?> clazz: classes) {
            System.out.printf("class name: %s, class package name: %s",
                    clazz.getSimpleName(),
                    clazz.getPackageName());

            Class<?>[] implementedInterfaces = clazz.getInterfaces();

            for (Class<?> implementedInterface : implementedInterfaces) {
                System.out.printf(", implemented interface: %s", implementedInterface.getSimpleName());
            }
            System.out.println();
            System.out.println("Is array: " + clazz.isArray());
            System.out.println("Is primitive: " + clazz.isPrimitive());
            System.out.println("Is interface: " + clazz.isInterface());
            System.out.println("Is enum: " + clazz.isEnum());
            System.out.println("Is annotation: " + clazz.isAnnotation());
            System.out.println("Is anonymous class: " + clazz.isAnonymousClass());

            System.out.println();
        }
    }

    private static class Square implements Drawable {

        @Override
        public int getNumberOfCorners() {
            return 4;
        }
    }

    private static interface Drawable {
        int getNumberOfCorners();
    }

    private enum Color {
        BLUE,
        RED,
        GREEN
    }
}