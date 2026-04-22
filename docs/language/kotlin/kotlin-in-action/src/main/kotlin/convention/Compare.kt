package convention

/**
 * 코틀린에서는 모든 객체에 대해 비교 연산을 수행할 수 있다.
 * equals나 compareTo를 호출해야 하는 자바와 달리
 * == 비교 연산자를 직접 사용할 수 있다.
 *
 * ==, != 는 내부에서 인자가 널인지 검사하므로 다른 연산과 달리 널이 될 수 있는 값에도 사용할 수 있다.
 * a == b
 * a?.equals(b) ?: (b == null)
 *
 * Any에서 상속받은 equals가 확장 함수보다 우선순위가 높다. 때문에 equals는 확장 함수로 정의할 수는 없다.
 * Any의 equals 에는 operator 키워드가 붙어있다.
 * 하위 클래스는 붙이지 않아도 된다.
 *
 * compareTo
 * 자바에서 정렬이나 최댓값, 최솟값 등 값을 비교해야 하는 알고리즘에 사용할 클래슨느 Comparable 인터페이스를 구현해야 한다.
 * 코틀린도 똑같은 인터페이스를 지원한다.
 * <, >, <=, >= 연산자는 compareTo 호출로 컴파일된다.
 * p1 >= p2
 * p1.compareTo(p2) >= 0
 */
class Person(val firstName: String, val lastName: String): Comparable<Person> {
    override fun compareTo(other: Person): Int {
        return compareValuesBy(this, other, Person::lastName, Person::firstName)
    }
}

fun main() {
    val p1 = Person("Alice", "Smith")
    val p2 = Person("Bob", "Johnson")
    println(p1 < p2)
}

