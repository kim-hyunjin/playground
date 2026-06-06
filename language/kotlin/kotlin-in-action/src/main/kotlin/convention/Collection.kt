package convention

import java.lang.IndexOutOfBoundsException
import java.time.LocalDate

/**
 * 컬렉션을 다룰 때 가장 많이 쓰는 연산은 인덱스를 사용해 원소를 읽거나 쓰는 연산과
 * 어떤 값이 컬렉션에 속해있는지 검사하는 연산이다.
 * 이 모든 연산을 연산자 구문으로 사용할 수 있다.
 * 인덱스를 사용해 원소를 설정하거나 가져오고 싶을 때는 a[b]라는 식을 사용한다. (인덱스 연산자)
 *
 * in 연산자는 원소가 컬렉션이나 범위에 속하는지 검사하거나 컬렉션에 있는 원소를 이터레이션할 때 사용한다.
 * 사용자 지정 클래스에 이런 연산을 추가할 수 있다.
 */

operator fun Point.get(index: Int): Int {
    return when(index) {
        0 -> x
        1 -> y
        else ->
            throw IndexOutOfBoundsException("Invalid coordinate $index")
    }
}

data class MutablePoint(var x: Int, var y: Int)

operator fun MutablePoint.set(index: Int, value: Int) {
    when (index) {
        0 -> x = value
        1 -> y = value
        else ->
            throw IndexOutOfBoundsException("Invalid coordinate $index")
    }
}

/**
 * in 관례
 * 객체가 컬렉션에 들어있는지 검사한다. 대응하는 함수는 contains다.
 */
data class Rectangle(val upperLeft: Point, val lowerRight: Point)

operator fun Rectangle.contains(p: Point): Boolean {
    return p.x in upperLeft.x until lowerRight.x && p.y in upperLeft.y until lowerRight.y
}

/**
 * rangeTo 관례
 * 범위를 만들려면 ..구문을 사용해야 한다. ..연산자는 rangeTo 함수를 간략하게 표현하는 방법이다.
 * 코틀린 표준 라이브러리에는 모든 Comparable 객체에 대해 적용 가능한 rangeTo 함수가 들어있다.
 * operator fun <T: Comparable<T>> T.rangeTo(that: T): ClosedRange<T>
 *
 * rangeTo 연산자는 다른 산술 연산자보다 우선순위가 낮다.
 * (0..n).forEach { println(it) } // 따라서 범위의 메소드를 호출하려면 괄호로 둘러싸야 한다.
 */

/**
 * iterator 관례
 * iterator를 정의하면 for 루프에서 사용할 수 있다.
 */
operator fun ClosedRange<LocalDate>.iterator(): Iterator<LocalDate> = object: Iterator<LocalDate> {
    var current = start
    override fun hasNext(): Boolean {
        return current <= endInclusive
    }

    override fun next(): LocalDate {
        return current.apply { current = plusDays(1) }
    }

}


fun main() {
    val p = Point(10, 20)
    println(p[1])

    val p2 = MutablePoint(10, 20)
    p2[1] = 42
    println(p2)

    val rect = Rectangle(Point(10, 20), Point(50, 50))
    println(Point(20, 20) in rect)
    println(Point(5, 5) in rect)

    val now = LocalDate.now()
    val vacation = now..now.plusDays(10) // now.rangeTo(now.plusDays(10))
    println(now.plusWeeks(1) in vacation)

    val newYear = LocalDate.ofYearDay(2017, 1)
    val daysOff = newYear.minusDays(1)..newYear
    for (dayOff in daysOff) { println(dayOff) }
}