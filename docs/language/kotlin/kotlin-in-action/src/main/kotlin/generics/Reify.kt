package generics

import java.lang.IllegalArgumentException

/**
 * 실행 시 제네릭스의 동작: 소거된 타입 파라미터와 실체화된 타입 파라미터
 *
 * JVM의 제네릭스는 타입 소거(type erasure)를 사용해 구현된다.
 * 이는 실행 시점에 제네릭 클래스의 인스턴스에 타입 인자 정보가 들어있지 않다는 뜻이다.
 *
 * 함수를 inline으로 만들면 타입 인자가 지워지지 않게 할 수 있다.(reify)
 */

/**
 * 실행 시점의 제네릭: 타입 검사와 캐스트
 * 자바와 마찬가지로 코틀린 제네릭 타입 인자 정보는 런타임에 지워진다.
 * 이는 제네릭 클래스 인스턴스가 그 인스턴스를 생성할 때 쓰인 타입 인자에 대한 정보를 유지하지 않는다는 뜻이다.
 * 예를 들어 List<String> 객체를 만들고 그 안에 문자열을 여럿 넣더라도 실행 시점에는 그 객체를 오직 List로만 볼 수 있다.
 * 그 List 객체가 어떤 타입의 원소를 저장하는지 실행 시점에는 알 수 없다.
 */
fun main() {
    /**
     * 컴파일러는 아래 두 리스트를 서로 다른 타입으로 인식하지만 실행 시점에 그 둘은 완전히 같은 타입의 객체다.
     * 그럼에도 보통은 List<String>에는 문자열만 들어가고
     * List<Int>에는 정수만 들어있다고 가정할 수 있는데
     * 컴파일러가 타입 인자를 알고 올바른 타입의 값만 각 리스트에 넣도록 보장해주기 때문이다.
     */
    val list1: List<String> = listOf("a", "b")
    val list2: List<Int> = listOf(1, 2, 3)

    /**
     * 타입 소거로 인해 생기는 한계
     */
//    if (value is List<String>) {...} // 검사 불가
    if (list1 is List<*>) {} // 스타 프로젝션(*)을 사용하면 리스트인걸 확인할 수 있다.

    fun printSum(c: Collection<*>) {
        val intList = c as? List<Int> ?: throw IllegalArgumentException("List is expected")
        println(intList.sum())
    }

    printSum(listOf(1, 2, 3))
//    printSum(setOf(1, 2, 3)) // 예외발생(IllegalArgumentException)
//    printSum(listOf("a", "b", "c")) // 캐스트는 성공하지만 다른 예외 발생(ClassCastException)

    println(isA<String>("abc")) // true
    println(isA<String>(123)) // false

    // 실체화한 타입 파라미터를 활용하는 가장 간단한 예
    val items = listOf("one", 2, "three")
    println(items.filterIsInstance<String>())
}

/**
 * inline 함수의 타입 파라미터는 실체화되므로 실행 시점에 타입 인자를 알 수 있다.
 */
inline fun <reified T> isA(value: Any) = value is T

/**
 * 인라인 함수에서만 실체화한 타입 인자를 쓸 수 있는 이유
 *
 * 컴파일러는 인라인 함수의 본문을 구현한 바이트코드를 그 함수가 호출되는 모든 지점에 삽입한다.
 * 컴파일러는 실체화된 타입 인자를 사용해 인라인 함수를 호출하는 각 부분의 정확한 타입 인자를 알 수 있다.
 * 따라서 컴파일러는 타입 인자로 쓰인 구체적인 클래스를 참조하는 바이트코드를 생성해 삽입할 수 있다.
 *
 * 타입 파라미터가 아니라 구체적인 타입을 사용하므로 만들어진 바이트코드는 실행 시점에 벌어지는 타입 소거의 영향을 받지 않는다.
 *
 * 자바코드에서는 reified 타입 파라미터를 사용하는 inline 함수를 호출할 수 없다!
 *
 * 자바에서는 코틀린 인라인 함수를 다른 보통 함수처럼 호출한다.
 * 인라인 함수를 호출해도 인라이닝 되지 않는다.
 *
 */

/**
 * 실체화한 타입 파라미터의 제약
 * - 타입 파라미터 클래스의 인스턴스 생성하기
 * - 타입 파라미터 클래스의 동반 객체 메소드 호출하기
 * - 실체화한 타입 파라미터를 요구하는 함수를 호출하면서 실체화하지 않은 타입 파라미터로 받은 타입을 타입 인자로 넘기기
 * - 클래스, 프로퍼티, 인라인 함수가 아닌 함수의 타입 파라미터를 reified로 지정하기
 */