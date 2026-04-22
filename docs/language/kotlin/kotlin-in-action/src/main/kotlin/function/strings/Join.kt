package function.strings

import java.lang.StringBuilder

/*
    코틀린에서는 함수 선언에서 파라미터의 디폴트 값을 지정할 수 있다.
    따라서 인자값을 다르게 여러 함수를 오버로드 할 필요가 없다.
    자바에서 코틀린 함수를 호출할 때는 디폴트 파라미터 값을 제공하더라도 모든 인자를 명시해야 한다.
    @JvmOverloads 애노테이션을 추가하면 코틀린 컴파일러가 자동으로 맨 마지막 파라미터로부터 파라미터를 하나씩 생략한 오버로딩한 자바 메소드를 추가해준다.

    자바에서 모든 함수는 클래스 안에 선언해야 하지만 코틀린에서는 그럴 필요가 전혀 없다.
    join.kt파일은 JoinKt라는 이름의 클래스로 만들어지고 joinToString 함수는 JoinKt클래스의 static 메소드가 된다.
    따라서 자바에서 joinToString 함수를 호출할 수 있게 된다.

    코틀린 최상위 함수가 포함되는 클래스의 이름을 바꾸고 싶다면 @JvmName 애노테이션을 추가하자.
    @file:JvmName("StringFunction") // 클래스 이름을 지정하는 애노테이션
    package function.strings // 애노테이션 뒤에 패키지 문이 와야 한다.
* */
fun <T> joinToString(
    collection: Collection<T>,
    separator: String = ", ",
    prefix: String = "",
    postfix: String = ""
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in collection.withIndex()) {
        if (index > 0) result.append(separator)
        result.append(element)
    }
    result.append(postfix)
    return result.toString()
}

/*
* 기본적으로 최상위 프로퍼티도 다른 모든 프로퍼티처럼 접근자 메소드를 통해 자바에 노출된다.
* val의 경우 게터,
* var의 경우 게터와 세터가 생긴다.
*
* public static final 필드로 컴파일되게 하려면 const 변경자를 추가하면 된다.
* */
var opCount = 0
val UNIX_LINE_SEPARATOR = "\n"
const val PUBLIC_STATIC_FINAL_VAL = "\n"