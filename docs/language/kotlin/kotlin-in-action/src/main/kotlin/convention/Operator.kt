package convention

import java.math.BigDecimal

/**
 * 자바에는 표준 라이브러리와 밀접하게 연관된 언어 기능이 몇 가지 있다.
 * for ... in 루프에 java.lang.Iterable을 구현한 객체를 사용할 수 있고,
 * try-with-resource 문에 java.lang.AutoCloseable을 구현한 객체를 사용할 수 있다.
 *
 * 코틀린에서도 어떤 언어 기능이 정해진 사용자 작성 함수와 연결되는 경우가 몇 가지 있다.
 * 하지만 코틀린에서는 이런 언어 기능이 어떤 타입(클래스)과 연관되기보다는 특정 함수 이름과 연관된다.
 * 예를 들어 어떤 클래스 안에 plus라는 이름의 특별한 메소드를 정의하면 그 클래스의 인스턴스에 대해 + 연산자를 사용할 수 있다.
 * 이런 식으로 어떤 언어 기능과 미리 정해진 이름의 함수를 연결해주는 기법을 관례(convention)라고 부른다.
 *
 * 언어 기능을 타입에 의존하는 자바와 달리 코틀린은 관례에 의존한다.
 * 코틀린에서 이런 관례를 채택한 이유는 기존 자바 클래스를 코틀린 언어에 적용하기 위함이다.
 * 기존 자바 클래스가 구현하는 인터페이스는 이미 고정돼 있고 코틀린 쪽에서 자바 클래스가 새로운 인터페이스를 구현하게 만들 수는 없다.
 *
 * 반면 확장 함수를 사용하면 기존 클래스에 새로운 메소드를 추가할 수 있다.
 * 따라서 기존 자바 클래스에 대해 확장 함수를 구현하면서 관례에 따라 이름을 붙이면 기존 자바 코드를 바꾸지 않아도 새로운 기능을 쉽게 부여할 수 있다.
 *
 */
data class Point(val x: Int, val y: Int) {
    // 이항 산술 연산 오버로딩
    operator fun plus(other: Point): Point { // operator 키워드는 필수다. 어떤 함수가 관례를 따르는 함수임을 명확히 할 수 있다.
        return Point(x + other.x, y + other.y)
    }
}

/**
 * 오버로딩 가능한 이항 산술 연산자
 * 식        | 함수 이름
 * a * b        times
 * a / b        div
 * a % b        mod(1.1부터는 rem)
 * a + b        plus
 * a - b        minus
 */

/**
 * 연산자 함수와 자바
 * 코틀린 연산자를 자바에서 호출하기는 쉽다. 오버로딩한 연산자는 함수로 정의되므로
 * 일반 함수로 호출할 수 있다.
 *
 * 자바를 코틀린에서 호출하는 경우, 함수 이름이 관례에 맞기만 하면 연산자 식을 사용해 그 함수를 호출할 수 있다.
 */

/**
 * 연산자를 정의할 때 두 피연산자가 같은 타입일 필요는 없다.
 */
operator fun Point.times(scale: Double): Point {
    return Point((x * scale).toInt(), (y * scale).toInt())
}

/**
 * 반환 타입도 두 피연산자와 일치해야만 하는 것도 아니다.
 */
operator fun Char.times(count: Int): String {
    return toString().repeat(count)
}

/**
 * 복합 대입 연산자
 *
 * 코틀린 표준 라이브러리는 컬렉션에 대해 두 가지 접근 방법을 함께 제공한다.
 * +와 -는 항상 새로운 컬렉션을 반환하며,
 * +=와 -= 연산자는 항상 변경 가능한 컬렉션에 작용해 메모리에 있는 객체 상태를 변환시킨다.
 *
 * 또한 읽기 전용 컬렉션에서 +=와 -=는 변경을 적용한 복사본을 반환한다.
 */
operator fun <T> MutableCollection<T>.plusAssign(element: T) {
    this.add(element)
}

/**
 * 단한 연산자
 * 식        | 함수 이름
 * +a           unaryPlus
 * -a           unaryMinus
 * !a           not
 * ++a, a++     inc
 * --a, a--     dec
 */
operator fun Point.unaryMinus(): Point {
    return Point(-x, -y)
}

operator fun BigDecimal.inc() = this + BigDecimal.ONE

fun main() {
    val p1 = Point(10, 20)
    val p2 = Point(30, 40)
    println(p1 + p2) // plus 함수가 호출된다.

    println(p1 * 1.5) // 코틀린 연산자가 교환 법칙을 지원하지는 않는다. 따라서 1.5 * p1 으로 사용할 수는 없다.

    println('a' * 3)

    val list = arrayListOf(1, 2)
    list += 3 // list를 변경한다.
    println(list)
    val newList = list + listOf(4, 5) // 두 리스트의 모든 원소를 포함하는 새로운 리스트를 반환한다.
    println(newList)

    println(-p1)

    var bd = BigDecimal.ZERO
    println(bd++)
    println(++bd)
}