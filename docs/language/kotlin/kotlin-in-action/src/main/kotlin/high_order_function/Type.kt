package high_order_function

import java.lang.StringBuilder

/**
 * 고차 함수는 다른 함수를 인자로 받거나 함수를 반환하는 함수다.
 * 코틀린에서는 람다나 함수 참조를 사용해 함수를 값으로 표현할 수 있다.
 * 따라서 고차 함수는 람다나 함수 참조를 인자로 넘길 수 있거나
 * 람다나 함수 참조를 반환하는 함수다.
 *
 * list.filter { x > 0 }
 */

/**
 * 함수 타입
 */
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
val action: () -> Unit = { println(42) } // Unit 타입은 의미 있는 값을 반환하지 않는 함수 반환 타입에 쓰는 특별한 타입
var canReturnNull: (Int, Int) -> Unit? = { x, y -> null }
var funOrNull: ((Int, Int) -> Int)? = null

/**
 * 인자로 받은 함수 호출
 */
fun twoAndThree(operation: (Int, Int) -> Int) {
    val result = operation(2, 3)
    println("The Result is $result")
}

fun String.filter(predicate: (Char) -> Boolean): String {
    val sb = StringBuilder()
    for (index in 0 until length) {
        val element = get(index)
        if (predicate(element)) sb.append(element)
    }
    return sb.toString()
}

/**
 * 디폴트 값 지정 함수 타입 파라미터
 */
fun <T> Collection<T>.joinToString(
    separator: String = ", ",
    prefix: String = "",
    postfix: String = "",
    transform: (T) -> String = { it.toString() } // 함수 타입 파라미터를 선언하면서 람다를 디폴트 값으로 지정
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in this.withIndex()) {
        if (index > 0) result.append(separator)
        result.append(transform(element))
    }
    result.append(postfix)
    return result.toString()
}

/**
 * 널이 될 수 있는 함수 타입 파라미터
 */
fun <T> Collection<T>.joinToString2(
    separator: String = ", ",
    prefix: String = "",
    postfix: String = "",
    transform: ((T) -> String)? = null // 널이 될 수 있는 함수 타입 파라미터
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in this.withIndex()) {
        if (index > 0) result.append(separator)
        val str = transform?.invoke(element) ?: element.toString() // 안전 호출 사용.
    }
    result.append(postfix)
    return result.toString()
}

/**
 * 함수를 반환하는 함수
 */
enum class Delivery { STANDARD, EXPEDITED }
class Order(val itemCount: Int)

fun getShippingCostCalculator(delivery: Delivery): (Order) -> Double {
    if (delivery == Delivery.STANDARD) {
        return { order -> 6 + 2.1 * order.itemCount }
    }
    return { order -> 1.2 * order.itemCount }
}

data class Person(
    val firstName: String,
    val lastName: String,
    val phoneNumber: String?
)

class ContactListFilters {
    var prefix: String = ""
    var onlyWithPhoneNumber: Boolean = false

    fun getPredicate(): (Person) -> Boolean {
        val startsWithPrefix = { p: Person -> p.firstName.startsWith(prefix) || p.lastName.startsWith(prefix) }
        if (!onlyWithPhoneNumber) {
            return startsWithPrefix
        }
        return { startsWithPrefix(it) && it.phoneNumber != null }
    }
}

/**
 * 람다를 활용한 중복 제거
 * 코드 중복을 줄일 때 함수 타입이 상당히 도움이 된다.
 * 코드의 일부분을 붙여 넣고 싶은 경우가 있다면 그 코드를 람다로 만들면 중복을 제거할 수 있을 것이다.
 */
data class SiteVisit(
    val path: String,
    val duration: Double,
    val os: OS
)

enum class OS { WINDOWS, LINUX, MAC, IOS, ANDROID }

val log = listOf(
    SiteVisit("/", 34.0, OS.WINDOWS),
    SiteVisit("/", 22.0, OS.MAC),
    SiteVisit("/login", 12.0, OS.WINDOWS),
    SiteVisit("/signup", 8.0, OS.IOS),
    SiteVisit("/", 16.3, OS.ANDROID),
)

// 하드 코딩 필터
val averageWindowsDuration = log.filter { it.os == OS.WINDOWS }.map(SiteVisit::duration).average()

// 일반 함수 사용
fun List<SiteVisit>.averageDurationFor(os: OS) = filter { it.os == os }.map(SiteVisit::duration).average()

// 고차 함수 사용
fun List<SiteVisit>.averageDurationFor(predicate: (SiteVisit) -> Boolean) =
    filter(predicate).map(SiteVisit::duration).average()

/**
 * 일부 잘 알려진 디자인 패턴을 함수 타입과 람다 식을 사용해 단순화할 수 있다.
 * 전략 패턴을 생각해보자.
 * 람다 식이 없다면 인터페이스를 선언하고 구현 클래스를 통해 전략을 정의해야 한다.
 * 함수 타입을 언어가 지원하면 일반 함수 타입을 사용해 전략을 표현할 수 있고,
 * 경우에 따라 다른 람다 식을 넘김으로써 여러 전략을 전달할 수 있다.
 */

fun main() {
    twoAndThree { a, b -> a + b }
    twoAndThree { a, b -> a * b }

    val letters = listOf("Alpha", "Beta")
    println(letters.joinToString()) // 디폴트 함수 사용
    println(letters.joinToString { it.toLowerCase() }) // 람다를 인자로 전달
    println(letters.joinToString(separator = "! ", postfix = "! ") { it.toUpperCase() })

    val calculator = getShippingCostCalculator(Delivery.EXPEDITED)
    println("Shipping costs ${calculator(Order(3))}")


    val contacts = listOf(
        Person("Dmitry", "Jemerov", "123-4567"),
        Person("Svetlana", "Isakova", null)
    )
    val contactListFilters = ContactListFilters()
    with(contactListFilters) {
        prefix = "Dm"
        onlyWithPhoneNumber = true
    }
    println(contacts.filter(contactListFilters.getPredicate()))

    println(log.averageDurationFor { it.os in setOf(OS.ANDROID, OS.IOS) })
    println(log.averageDurationFor { it.os == OS.IOS && it.path == "/signup" })
}

/**
 * 자바에서 코틀린 함수 타입 사용
 * 컴파일된 코드 안에서 함수 타입은 일반 인터페이스로 바뀐다.
 * 즉 함수 타입의 변수는 FunctionN 인터페이스를 구현하는 객체를 저장한다.
 * 코틀린 표준 라이브러리는 함수 인자의 개수에 따라
 *      Function0<R> : 인자가 없는 함수
 *      Function1<P1, R> : 인자가 하나인 함수
 * 등의 인터페이스를 제공한다.
 * 각 인터페이스에는 invoke 메소드 정의가 하나 들어 있다.
 *
 * 함수 타입의 변수는 인자 개수에 따라 적당한 FunctionN 인터페이스를 구현하는 클래스 인스턴스를 저장하며,
 * invoke 메소드 본문에는 람다의 본문이 들어간다.
 *
 * // 코틀린선언
 * fun processTheAnswer(f: (Int) -> Int) {
 *      println(42)
 * }
 *
 * // 자바에서 사용
 * processTheAnswer(number -> number + 1);
 *
 * // 자바8 이전
 * processTheAnswer(
 *      new Function1<Integer, Integer>() {
 *          @override
 *          public Integer invoke(Integer number) {
 *              System.out.println(number);
 *              return number + 1;
 *          }
 *      });
 *
 */