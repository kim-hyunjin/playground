package type_system

import java.lang.IllegalStateException

/**
 * Any, Any? : 최상위 타입
 * 자바에서 Object가 클래스 계층의 최상위 타입이듯
 * 코틀린에서는 Any 타입이 모든 널이 될 수 없는 타입의 조상 타입이다.
 * 하지만 자바에서는 참조 타입만 Object를 정점으로 하는 타입 계층에 포함되며,
 * 원시 타입은 그런 계층에 들어있지 않다.
 * 하지만 코틀린에서는 Any가 Int 등의 원시 타입을 포함한 모든 타입의 조상 타입이다.
 *
 * 자바와 마찬가지로 코틀린에서도 원시 타입 값을 Any 타입의 변수에 대입하면 자동으로 값을 객체로 감싼다.
 *
 * 널을 포함하는 모든 값을 대입할 변수를 선언하려면 Any? 타입을 사용해야 한다.
 *
 * 내부에서 Any 타입은 java.lang.Object 에 대응한다.(정확히는 플랫폼 타입인 Any!로 취급)
 */


/**
 * Unit 타입 : 코틀린의 void
 * 코틀린 Unit 타입은 자바 voiddhk rkxdms rlsmddmf gksek.
 * 다른 점은, Unit은 모든 기능을 갖는 일반적인 타입이며, void와 달리, Unit을 타입 인자로 쓸 수 있다.
 * Unit 타입에 속한 값은 하나뿐이며, 이름이 Unit이다.
 */
interface Processor<T> {
    fun process(): T
}
class NoResultProcessor: Processor<Unit> {
    override fun process() {
        // 업무 처리 코드
        // 명시적으로 Unit을 반환할 필요 없다. 컴파일러가 묵시적으로 return Unit을 넣어준다.
    }
}

/**
 * Nothing 타입 : 이 함수는 결코 정상적으로 끝나지 않는다.
 * 코틀린에는 결코 성공적으로 값을 돌려주는 일이 없으므로 반환 값 개념 자체가 의미없는 함수가 일부 존재한다.
 * 예) 테스트 라이브러리의 fail 함수
 * 그런 경우를 표현하기 위해 코틀린에는 Nothing 이라는 특별한 반환 타입이 있다.
 *
 * Nothing을 반환하는 함수를 엘비스 연산자의 우항에 사용해서 전제 조건을 검사할 수 있다.
 */
fun fail(message: String): Nothing {
    throw IllegalStateException(message)
}

fun main() {
    val company = Company("jetbrains", address = null)
    val address = company.address ?: fail("No address")
}