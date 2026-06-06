package lambda.collection

import lambda.Person

/**
 * 컬렉션의 모든 원소를 어떤 특성에 따라 여러 그룹으로 나누고 싶다면 groupBy 함수를 사용하면 된다.
 */
fun main() {
    val people = listOf(Person("Alice", 31), Person("Bob", 29), Person("Carol", 31))
    // 이 연산의 결과는 컬렉션의 원소를 구분하는 특정(여기선 age)이 key이고, key값에 따른 각 그룹이 값인 map이다.
    println(people.groupBy { it.age })

    val list = listOf("a", "ab", "b")
    println(list.groupBy(String::first))
}