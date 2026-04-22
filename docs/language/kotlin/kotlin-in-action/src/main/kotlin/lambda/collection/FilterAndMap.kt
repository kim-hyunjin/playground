package lambda

import java.util.*

/**
 * 함수형 프로그래밍 스타일을 사용하면 컬렉션을 다룰 때 편리하다.
 *
 * 대부분의 컬렉션 연산은 filter와 map 이 두 함수로 표현할 수 있다.
 */
fun main() {
    val list = listOf(1, 2, 3, 4)
    // filter 함수는 컬렉션을 이터레이션 하면서 주어진 람다에 각 원소를 넘겨 람다가 true를 반환하는 원소만 모은다.
    println(list.filter { it % 2 == 0 })

    val people = listOf(Person("Alice", 29), Person("Bob", 31))
    println(people.filter { it.age > 30 })

    // map 함수는 주어진 람다를 컬렉션의 각 원소에 적용한 결과를 모아서 새 컬렉션을 만든다.
    println(list.map { it * it })
    println(people.map { it.name })
    println(people.map(Person::name)) // 멤버 참조 사용

    // 이런 호출을 쉽게 연쇄시킬 수 있다.
    println(people.filter { it.age > 30 }.map(Person::name))

    people.filter { it.age == people.maxByOrNull(Person::age)!!.age }
    // 위 코드는 목록에서 최댓값을 구하는 작업을 계속 반복한다는 단점이 있다.
    // 다음은 이를 개선한 코드다.
    val maxAge = people.maxByOrNull(Person::age)!!.age
    people.filter { it.age == maxAge }
    // 꼭 필요하지 않은 경우 굳이 계산을 반복하지 말라!

    // 필터와 변환 함수를 맵(딕셔너리)에 적용할 수도 있다.
    val numbers = mapOf(0 to "zero", 1 to "one")
    println(numbers.mapValues { it.value.uppercase(Locale.getDefault()) })
    // 맵의 경우 키와 값을 처리하는 함수가 따로 존재한다.
    // filterKeys와 mapKeys는 키를 걸러 내거나 변환하고,
    // filterValues와 mapValues는 값을 걸러 내거나 변환한다.
}