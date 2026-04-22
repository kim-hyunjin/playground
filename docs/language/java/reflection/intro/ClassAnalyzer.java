import java.util.*;
public class ClassAnalyzer {
    private static final List<String> JDK_PACKAGE_PREFIXES =
            Arrays.asList("com.sun.", "java", "javax", "jdk", "org.w3c", "org.xml");

    public static PopupTypeInfo createPopupTypeInfoFromClass(Class<?> inputClass) {
        PopupTypeInfo popupTypeInfo = new PopupTypeInfo();

        /** Complete the Code **/


        popupTypeInfo.setPrimitive(inputClass.isPrimitive())
                .setInterface(inputClass.isInterface())
                .setEnum(inputClass.isEnum())
                .setName(inputClass.getSimpleName())
                .setJdk(isJdkClass(inputClass))
                .addAllInheritedClassNames(getAllInheritedClassNames(inputClass));

        return popupTypeInfo;
    }

    /*********** Helper Methods ***************/

    public static boolean isJdkClass(Class<?> inputClass) {
        /** Complete the code 
         Hint: What does inputClass.getPackage() return when the class is a primitive type?
         **/
        Package pkg = inputClass.getPackage();
        if (pkg == null) return true;

        for (String prefix : ClassAnalyzer.JDK_PACKAGE_PREFIXES) {
            boolean isStartWithJDK_PACKAGE_PREFIXES = pkg.getName().startsWith(prefix);
            if (isStartWithJDK_PACKAGE_PREFIXES) return true;
        }
        return false;
        /**
         * 솔루션
         * return JDK_PACKAGE_PREFIXES.stream()
         *                 .anyMatch(packagePrefix -> inputClass.getPackage() == null
         *                             || inputClass.getPackage().getName().startsWith(packagePrefix));
         */
    }

    public static String[] getAllInheritedClassNames(Class<?> inputClass) {
        /** Complete the code
         Hints: What does inputClass.getSuperclass() return when the inputClass doesn't inherit from any class?
         What does inputClass.getSuperclass() return when the inputClass is a primitve type?

         **/
        List<String> inheritedClassNames = new ArrayList<>();
        Class<?> superClass = inputClass.getSuperclass();
        while (superClass != null) {
            inheritedClassNames.add(superClass.getName());
            superClass = superClass.getSuperclass();
        }
        return inheritedClassNames.toArray(new String[0]);

        /**
         * 솔루션
         * String[] inheritedClasses;
         *         if (inputClass.isInterface()) {
         *             inheritedClasses = Arrays.stream(inputClass.getInterfaces())
         *                     .map(Class::getSimpleName)
         *                     .toArray(String[]::new);
         *         } else {
         *             Class<?> inheritedClass = inputClass.getSuperclass();
         *             inheritedClasses = inheritedClass != null ?
         *                     new String[]{inputClass.getSuperclass().getSimpleName()}
         *                     : null;
         *         }
         *         return inheritedClasses;
         */
    }
}