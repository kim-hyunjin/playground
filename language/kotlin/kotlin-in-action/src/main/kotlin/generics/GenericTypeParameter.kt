package generics

import java.lang.StringBuilder

/**
 * 제네릭 타입 파라미터
 * 제네릭스를 사용하면 타입 파라미터를 받는 타입을 정의할 수 있다.
 * 제네릭 타입의 인스턴스를 만들려면 타입 파라미터를 구체적인 타입 인자로 치환해야 한다.
 *
 *    타입파라미터 선언
 * fun <T> List<T>.slice(indices: IntRange): List<T>
 *            타입 파라미터가 수신 객체와 반환 타입에 쓰인다.
 */

/**
 * 타입 파라미터 제약
 * fun <T: Number> List<T>.sum(): T
 * 위에서 T는 Number의 하위타입이어야 한다.
 */
fun <T: Number> oneHalf(value: T): Double {
    return value.toDouble() / 2.0
}

fun <T: Comparable<T>> max(first: T, second: T): T {
    return if (first > second) first else second
    // first > second 라는 식은 first.compareTo(second) > 0 으로 컴파일 된다.
}

fun <T> ensureTrailingPeriod(seq: T) where T: CharSequence, T: Appendable { // 타입파라미터에 여러 제약 가하기
        if (!seq.endsWith('.')) {
            seq.append('.')
        }
}

/**
 * 타입 파라미터를 널이 될 수 없는 타입으로 한정
 * Any를 상한으로 사용하기
 */
class Processor<T> {
    fun process(value: T) {
        value?.hashCode() // value는 널이 될 수 있다.
    }
}

class Processor2<T: Any> {
    fun process(value: T) {
        value.hashCode()
    }
}

fun main() {
    println(oneHalf(3))
    println(max("kotlin", "java"))

    val helloWorld = StringBuilder("Hello World")
    ensureTrailingPeriod(helloWorld)
    println(helloWorld)

    val nullableStringProcessor = Processor<String?>()
    nullableStringProcessor.process(null)
}