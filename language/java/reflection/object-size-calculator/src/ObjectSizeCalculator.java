import java.lang.reflect.*;

/**
 * 입력값: 어떤 클래스의 객체
 * 
 * 결괏값: 객체가 JVM에서 차지하는 메모리 크기의 측정값이 바이트 단위로 나옵니다.
 * 
 * 공식
 * 
 * SizeOf(객체) = {헤더 크기} + {객체 레퍼런스} + {모든 필드의 크기의 총합}
 * 
 * 
 * 전제:
 * 
 * 헤더 크기 = 12 바이트
 * 
 * 객체 레퍼런스 = 4바이트 (힙의 사이즈가 우리가 측정하기에 충분한 크기인 32GB 이하의 JVM일 경우에는 이렇게 적용됩니다)
 * 
 * 
 * 작업을 단순화하기 위해, 우리 클래스에서 가질 수 있는 필드의 타입은 다음과 같습니다.
 * 
 * int
 * 
 * byte
 * 
 * long
 * 
 * double
 * 
 * float
 * 
 * short
 * 
 * String
 * 
 * (다른 타입도 추후에 간단하게 추가할 수 있습니다)
 * 
 * 또한, 우리는 해당 클래스가 슈퍼 클래스에서 어떠한 필드도 상속받지 않는다고 가정할 수 있습니다.
 */
public class ObjectSizeCalculator {
    private static final long HEADER_SIZE = 12;
    private static final long REFERENCE_SIZE = 4;

    public long sizeOfObject(Object input) throws IllegalAccessException {
        /**
         * Complete your code here
         */
        long allFieldSize = 0;

        Field[] fields = input.getClass().getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            field.setAccessible(true);

            if (field.isSynthetic()) {
                continue;
            }

            if (field.getType().isPrimitive()) {
                allFieldSize += sizeOfPrimitiveType(field.getType());
            } else if (field.getType().equals(String.class)) {
                allFieldSize += sizeOfString(field.get(input).toString());
            }
        }

        return HEADER_SIZE + REFERENCE_SIZE + allFieldSize;
    }

    /*************** Helper methods ********************************/
    private long sizeOfPrimitiveType(Class<?> primitiveType) {
        if (primitiveType.equals(int.class)) {
            return 4;
        } else if (primitiveType.equals(long.class)) {
            return 8;
        } else if (primitiveType.equals(float.class)) {
            return 4;
        } else if (primitiveType.equals(double.class)) {
            return 8;
        } else if (primitiveType.equals(byte.class)) {
            return 1;
        } else if (primitiveType.equals(short.class)) {
            return 2;
        }
        throw new IllegalArgumentException(String.format("Type: %s is not supported", primitiveType));
    }

    private long sizeOfString(String inputString) {
        int stringBytesSize = inputString.getBytes().length;
        return HEADER_SIZE + REFERENCE_SIZE + stringBytesSize;
    }
}