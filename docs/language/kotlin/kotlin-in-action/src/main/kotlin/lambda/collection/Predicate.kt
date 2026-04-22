package lambda.collection

import lambda.Person

fun main() {
    val canBeInClub27 = { p: Person -> p.age <= 27 }
    val people = listOf(Person("Alice", 27), Person("Bob", 31))
    println(people.all(canBeInClub27))
    println(people.any(canBeInClub27))
    println(people.count(canBeInClub27))
    // count와 size
    println(people.filter(canBeInClub27).size) // 이 방식은 중간 켤렉션이 생긴다. 따라서 이보다는 count가 훨씬 더 효율적이다.
    println(people.find(canBeInClub27)) // 가장 먼저 조건을 만족한다고 확인된 원소를 반환한다. 만족하는 원소가 전혀 없는 경우 null을 반환한다.
    // find는 firstOfNull과 같다.

    val list = listOf(1, 2, 3)
    // !all을 수행한 결과와 그 조건의 부정에 대해 any를 수행한 결과는 같다.(드 모르강의 법칙)
    println(!list.all { it == 3 }) // !를 눈치채지 못하는 경우가 있다.
    println(list.any { it != 3 })
}