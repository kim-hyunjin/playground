package type_system

/**
 * 코틀린은 원시 타입과 래퍼 타입을 구분하지 않는다.
 * 대부분의 경우 코틀린의 Int 타입은 자바 int 타입으로 컴파일된다.
 * 컬렉션과 같은 제네릭 클래스에 사용하는 경우에는 java.lang.Integer 타입이 된다.
 *
 * 자바 가상머신(JVM)에서 제네릭을 구현하는 방법을 보면,
 * JVM이 타입 인자로 원시 타입을 허용하지 않는다.
 * 따라서 자바나 코틀린 모두에서 제네릭 클래스는 항상 박스 타입을 사용해야 한다.
 *
 * 자바 원시 타입에 해당하는 타입은 다음과 같다.
 * - 정수 타입: Byte, Short, Int, Long
 * - 부동소수점 타입: Float, Double
 * - 문자 타입: Char
 * - 불리언 타입: Boolean
 */
val i: Int = 1
val list: List<Int> = listOf(1, 2, 3)

fun showProgress(progress: Int) {
    val percent = progress.coerceIn(0, 100)
    println("We're ${percent}% done!")
}

/**
 * 널이 될 수 있는 원시 타입
 * null 참조를 자바의 참조 타입의 변수에만 대입할 수 있기 때문에
 * 널이 될 수 있는 코틀린 타입은 자바 원시 타입으로 표현할 수 없다.
 * 따라서 널이 될 수 있는 원시 타입을 사용하면 그 타입은 자바의 래퍼 타입으로 컴파일된다.
 *
 */
data class Person3(val name: String, val age: Int? = null) {
    fun isOlderThan(other: Person3): Boolean? {
        if (age == null || other.age == null) {
            return null
        }
        return age > other.age
    }
}

/**
 * 숫자 변환
 * 코틀린은 한 타입의 숫자를 다른 타입의 숫자로 자동 변환하지 않는다.
 * 대신 직접 변환 메소드를 호출해야 한다.
 */
val intI = 1
// val longI: Long = intI  // type mismatch 컴파일 에러
val longI: Long = intI.toLong()
val longList = listOf(1L, 2L, 3L)
fun printIntInLongList(i: Int, list: List<Long>) {
    println(i.toLong() in list)
}

/**
 * toByte(), toShort(), toChar() 등과 같이 코틀린은 Boolean을 제외한 모든 원시 타입에 대한 변환 함수를 제공한다.
 */

/**
 * 숫자 리터럴
 * L 접미사 - Long 타입 : 123L
 * 부동소수점 표기법 - Double 타입 : 0.12, 2.0, 1.2e10, 1.2e-10
 * f나 F 접미사 - Float 타입 : 123.4f, .456F, 1e3f
 * 0x나 0X 접두사 - 16진수 : 0xCAFEBABE, 0xbcdL
 * 0b나 0B 접두사 - 2진수 : 0b000000101
 *
 * 코틀린 1.1 부터는 숫자 리터럴 중간에 _ 을 넣을 수 있다 : 1_000, 1_000_000_000L, 1_000.123, ob0100_0001
 *
 * 문자 리터럴은 ''을 사용하며, 이스케이프 시퀀스를 사용할 수도 있다 : '1', '\t', '\u009'
 */
fun foo(l: Long) = println(l)

fun main() {
    showProgress(146)

    println(Person3("Sam", 35).isOlderThan(Person3("Amy", 42)))
    println(Person3("Sam", 35).isOlderThan(Person3("James")))

    printIntInLongList(intI, longList)
    foo(42) // 컴파일러는 42를 Long값으로 해석한다.
}
