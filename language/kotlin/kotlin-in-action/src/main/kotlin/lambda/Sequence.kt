package lambda

import java.io.File

/**
 * map이나 filter같은 몇 가지 컬렉션 함수는 결과 컬렉션을 즉시 생성한다.
 * 이는 컬렉션 함수를 연쇄하면 매 단계마다 계산 중간 결과를 새로운 컬렉션에 임시로 담는다는 말이다.
 * 시퀀스를 사용하면 중간 임시 컬렉션을 사용하지 않고도 컬력센 연산을 연쇄할 수 있다.
 *
 * people.map(Person::name).filter { it.startsWith("A") }
 *
 * 코틀린 표준 라이브러리 참조 문서에는 filter와 map이 리스트를 반환한다고 써 있다.
 * 이는 이 연쇄 호출이 리스트를 2개 만든다는 뜻이다.
 * 원소가 수백만 개가 되면 효율이 떨어진다.
 * 이를 더 효율적으로 만들기 위해서는 각 연산이 컬렉션을 직접 사용하는 대신 시퀀스를 사용하게 만들어야 한다.
 *
 * people.asSequence() // 원본 컬렉션을 시퀀스로 변환한다.
 *  .map(Person::name)
 *  .filter { it.startsWith("A) }
 *  .toList() // 결과 시퀀스를 다시 리스트로 변환한다.
 *
 *  위의 경우 중간 결과를 저장하는 컬렉션이 생기지 않기 때문에 원소가 많은 경우 성능이 눈에 띄게 좋아진다.
 *  코틀린 지연 계산 시퀀스는 Sequence 인터페이스에서 시작한다.
 *  이 인터페이스는 단지 한 번에 하나씩 열거될 수 있는 원소의 시퀀스를 표현할 뿐이다.
 *  Sequence 안에는 iterator라는 단 하나의 메소드가 있다.
 *  이 메소드를 통해 시퀀스로부터 원소 값을 얻을 수 있다.
 *
 *  Sequence 인터페이스의 장점은 스 인터페이스 위에 구현된 연산이 계산을 수행하는 방법 때문에 생긴다.
 *  시퀀스의 원소는 필요할 때 비로소 계산된다.
 *  따라서 중간 처리 결과를 저장하지 않고도 연산을 연쇄적으로 적용해서 호율적으로 계산을 수행할 수 있다.
 *
 *  asSequence 확장 함수를 호출하면 어떤 컬렉션이든 시퀀스로 바꿀 수 있다.
 *  시퀀스를 리스트로 만들 때는 toList를 사용한다.
 *
 *  왜 시퀀스를 다시 컬렉션으로 되돌려야 할까?
 *  시퀀스의 원소를 차례로 이터레이션해야 한다면 시퀀스를 직접 써도 된다.
 *  하지만 시퀀스 원소를 인덱스를 사용해 접근하는 등의 다른 API 메소드가 필요하다면
 *  시퀀스를 리스트로 변환해야 한다.
 *
 *  시퀀스에 대한 연산을 지연 계산하기 때문에 정말 계산을 실행하게 만들려면
 *  최종 시퀀스의 원소를 하나씩 이터레이션하거나 최종 시퀀스를 리스트로 변환해야 한다.
 *
 *  시퀀스에 대한 연산은 중간 연산과 최종 연산으로 나뉜다.
 *  중간 연산은 다른 시퀀스를 반환한다. 그 시퀀스는 최초 시퀀스의 원소를 변환하는 방법을 안다.
 *  최종 연산은 결과를 반환한다.
 *  중간 연산은 항상 지연 계산된다.
 */
fun main() {
    listOf(1, 2, 3, 4).asSequence().map {
        print("map($it) ");
        it * it
    }.filter {
        print("filter($it) ");
        it % 2 == 0
    } // 이 코드를 실행하면 아무 내용도 출력되지 않는다. 이는 map과 filter 변환이 늦춰져서 결과를 얻을 필요가 있을 때 적용된다는 뜻이다.

    listOf(1, 2, 3, 4).asSequence().map { // 중간 연산
        print("map($it) ");
        it * it
    }.filter { // 중간 연산
        print("filter($it) ");
        it % 2 == 0
    }.toList() // 최종 연산. 연기됐던 모든 계산이 수행된다.
    // 시퀀스의 경우 모든 연산은 각 원소에 대해 순차적으로 적용된다.
    // 따라서 아래의 경우 두 번째 원소를 처리하며 이미 답을 얻었기 때문에 3, 4는 연산하지 않는다.
    println(listOf(1, 2, 3, 4).asSequence().map { it * it }.find { it > 3 })

    val people = listOf(Person("Alice", 29), Person("Bob", 31), Person("Charles", 31), Person("Dan", 21))
    // 아래의 경우 map과 filter를 어느 순서로 해도 결과는 같다.
    // 하지만 먼저 filter를 수행하면 원소가 걸러지기 때문에 map을 수행할 원소 수도 적어지므로 전체 연산 횟수가 줄어든다.
    println(people.asSequence().map(Person::name).filter { it.length < 4 }.toList())
    println(people.asSequence().filter { it.name.length < 4 }.map(Person::name).toList())

    // 시퀀스 만들기
    val naturalNumbers = generateSequence(0) { it + 1 }
    val numbersTo100 = naturalNumbers.takeWhile { it <= 100 }
    println(numbersTo100.sum()) // 모든 지연 연산은 sum의 결과를 계산할 때 수행된다.

    // 여기서도 첫 번째 원소를 지정하고, 시퀀스의 한 원소로부터 다음 원소를 계산하는 방법을 제공함으로써 시퀀스를 만든다.
    fun File.isInsideHiddenDirectory() = generateSequence(this) { it.parentFile }.any { it.isHidden }
}

/**
 * 자바8 스트림은 코틀린의 시퀀스와 개념이 같다.
 * 코틀린에서 시퀀스를 따로 구현해 제공하는 이유는 자바8이전 버전을 지원하기 위해서다.
 * 자바8의 스트림 연산은 CPU에서 병렬적으로 실행한다.
 * 이는 코틀린에서 컬렉션과 시퀀스에서 제공하지 않는 중요한 기능이므로
 * 자바 버전에 따라 시퀀스와 스트림 중 적절한 쪽을 선택하면 된다.
 */