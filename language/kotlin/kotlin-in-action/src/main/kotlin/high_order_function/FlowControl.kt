package high_order_function

/**
 * 고차 함수 안에서 흐름 제어
 *
 * 람다 안의 return문: 람다를 둘러싼 함수로부터 반환
 *
 */
fun lookForAlice(people: List<Person2>) {
    for (person in people) {
        if (person.name == "Alice") {
            println("Found")
            return
        }
    }
    println("Alice is not found")
}
fun lookForAlice2(people: List<Person2>) {
    people.forEach {
        if (it.name == "Alice") {
            println("Found!")
            return // 람다 안에서 return을 사용하면 람다로부터 반환되는게 아니라 함수가 실행을 끝내고 반환된다.
            // 이렇게 자신을 둘러싸고 있는 블록보다 더 바깥에 있는 다른 블록을 반환하게 만드는 return문을 non-local return이라 부른다.
            // return이 바깥쪽 함수를 반환시킬 수 있는 때는 람다를 인자로 받는 함수가 인라인 함수인 경우뿐이다.
        }
    }
    println("Alice is not found")
}

/**
 * 람다로부터 반환: 레이블을 사용한 return
 *
 * 람다식에서도 local return을 사용할 수 있다.
 * 로컬 return은 for 루프의 break와 비슷한 역할을 한다.
 *
 * 레이블을 붙이면 된다.
 * 또는 인라인 함수의 이름을 return 뒤에 레이블로 사용해도 된다.
 */
fun lookForAlice3(people: List<Person2>) {
    people.forEach label@{ // 람다 식 앞에 레이블을 붙인다.
        if (it.name == "Alice") return@label
    }
    println("Alice might be somewhere")
}

/**
 * 무명함수: 기본적으로 로컬 return
 *
 * 무명 함수는 일반 함수와 비슷해보인다.
 * 차이는 함수 이름이나 파라미터 타입을 생략할 수 있다는 점뿐이다.
 */
fun lookForAlice4(people: List<Person2>) {
    people.forEach(fun (person) {
        if (person.name == "Alice") return
        println("${person.name} is not Alice")
    })
}

/**
 * 사실 return에 적용되는 규칙은 단순히 fun 키워드를 사용해 정의된 가장 안쪽 함수를 반환시킨다는 점이다.
 * 람다식은 fun을 사용해 정의되지 않았으므로 람다 밖의 함수를 반환시킨 것이다.
 */

fun main() {
    val people = listOf(Person2("Alice", 29), Person2("Bob", 31))

    lookForAlice(people)
    lookForAlice2(people)
    lookForAlice3(people)
}