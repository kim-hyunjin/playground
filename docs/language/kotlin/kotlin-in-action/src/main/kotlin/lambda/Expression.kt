package lambda

import java.awt.Button

/**
 * 람다는 기본적으로 다른 함수에 넘길 수 있는 작은 코드 조각을 뜻한다.
 * 람다를 사용하면 쉽게 공통 코드 구조를 라이브러리 함수로 빼낼 수 있다.
 * 코틀린 표준 라이브러리는 람다를 아주 많이 사용한다.
 *
 * 코드 블록을 함수 인자로 넘기기
 * "이벤트가 발생하면 이 핸들러를 실행하자", "데이터 구조의 모든 원소에 이 연산을 적용하자"와 같은 생각을
 * 코드로 표현하기 위해 일련의 동작을 변수에 저장하거나 다른 함수에 넘겨야 하는 경우가 자주 있다.
 * 예전에 자바에서는 무명 내부 클래스를 통해 이런 목적을 달성했다.
 *
 * 함수형 프로그래밍에서는 함수를 값처럼 다루는 접근 방법을 택함으로써 이 문제를 해결한다.
 * 함수형 언어에서는 함수를 직접 다른 함수에 전달할 수 있다.
 * 람다 식을 사용하면 코드가 더욱 더 간결해진다.
 * 함수를 선언할 필요가 없고 코드 블록을 직접 함수의 인자로 전달할 수 있다.
 */

data class Person(val name: String, val age: Int)

// 컬렉션을 직접 검색하는 함수
fun findTheOldest(people: List<Person>) {
    var maxAge = 0
    var theOldest: Person? = null
    for (person in people) {
        if (person.age > maxAge) {
            maxAge = person.age
            theOldest = person
        }
    }
    println(theOldest)
}

/**
 * 코틀린 람다 식은 항상 중괄호로 둘러싸여 있다.
 * 화살표(->)가 인자 목록과 람다 본문을 구분해준다.
 * 람다 식을 변수에 저장할 수 있다.
 * 람다가 저장된 변수를 다른 일반 함수와 마찬가지로 다룰 수 있다.
 */
val sum = {x: Int, y: Int -> x + y}

fun main() {
    val people = listOf(Person("Alice", 29), Person("Bob", 31))
    findTheOldest(people)

    // 람다를 사용해 컬렉션 검색하기
    println(people.maxByOrNull { it.age })
    // 멤버 참조를 사용해 컬렉션 검색하기
    println(people.maxByOrNull(Person::age))

    println(sum(1, 2));

    // 람다 식을 만들자마자 바로 호출할 수도 있다.
    {println(99)}()
    /*
        이와 같은 구문은 읽기 어렵고 그다지 쓸모도 없다.
        코드의 일부분을 블록으로 둘러싸 실행할 필요가 있다면 run을 사용한다.
        run은 인자로 받은 람다를 실행해주는 라이브러리 함수다.
    */
    run { println(77) }

    /*
    * 실행 시점에 코틀린 람다 호출에는 아무 부가 비용이 들지 않는다. 프로그램의 기본 구성요소와 비슷한 성능을 낸다.
    * */
    println(people.maxByOrNull({ person: Person -> person.age }))
    // 코틀린에는 함수 호출 시 맨 뒤에 있는 인자가 람다 식이라면 그 람다를 괄호 밖으로 빼낼 수 있다.
    println(people.maxByOrNull() { person: Person -> person.age })
    // 람다가 유일한 인자라면 괄호를 없애도 된다.
    println(people.maxByOrNull { person: Person -> person.age })

    val names = people.joinToString(" ", transform = { p: Person -> p.name })
    println(names)

    // 로컬 변수처럼 컴파일러는 람다 파라미터의 타입도 추론할 수 있다. 따라서 파라미터 타입을 명시할 필요가 없다.
    println(people.maxByOrNull { person -> person.age })

    /*
       마지막으로 람다의 파라미터 이름을 디폴트 이름인 it으로 바꾸면 람다 식을 더 간단하게 만들 수 있다.
       람다의 파라미터가 하나뿐이고 그 타입을 컴파일러가 추론할 수 있는 경우 it을 바로 쓸 수 있다.
       람다 파라미터 이름을 따로 지정하지 않은 경우에만 it이라는 이름이 자동으로 만들어진다.
       람다가 중첩되는 경우에는 it을 사용하기 보다 파라미터를 직접 명시하는 편이 낫다.
     */
    people.maxByOrNull { it.age }

    // 람다를 변수에 저장할 때는 파라미터의 타입을 추론할 문맥이 존재하지 않는다. 따라서 파라미터 타입을 명시해야 한다.
    val getAge = {p: Person -> p.age}
    people.maxByOrNull(getAge)

    // 본문이 여러 줄로 이뤄진 경우 본문의 맨 마지막에 있는 식이 람다의 결과 값이 된다.
    val sum = { x: Int, y: Int ->
        println("Computing the sum of $x and $y..")
        x + y
    }
    println(sum(1, 2))
}
/**
 * 자바 컬렉션에 대해 수행하던 대부분의 작업은 람다나 멤버 참조를 인자로 취하는 라이브러리 함수를 통해 개션할 수 있다.
 * 코드는 더 짧고 더 이해하기 쉽다.
 */
