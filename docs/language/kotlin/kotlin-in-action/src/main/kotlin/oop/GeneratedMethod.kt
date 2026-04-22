package oop

/**
 * toString()
 * 자바처럼 코틀린의 모든 클래스도 인스턴스의 문자열 표현을 얻을 방법을 제공한다.
 * 주로 디버깅과 로깅 시 이 메소드를 사용한다.
 *
 * equals()
 * 객체의 동등성을 비교할 때 호출하는 메서드
 *
 * hashCode()
 * 자바에서는 equals를 오버라이드할 때 반드시 hashCode도 함께 오버라이드해야 한다.
 * 예를 들어, HashSet에서 원소를 비교할 때 비용을 줄이기 위해
 * 먼저 객체의 해시 코드를 비교하고 같은 경우에만 실제 값을 비교한다.
 */
class Client(val name: String, val postalCode: Int) {
    override fun toString(): String {
        return "Client(name=$name, postalCode=$postalCode)"
    }

    override fun equals(other: Any?): Boolean { // Any는 java.lang.Object에 대응하는 클래스. 널이 뒬 수 있다.
        if (other == null || other !is Client) {
            return false
        }
        return name == other.name && postalCode == other.postalCode
    }

    override fun hashCode(): Int {
        return name.hashCode() * 31 + postalCode
    }
}

/**
 * data 변경자를 클래스 앞에 붙이면 위에서 오버라이드 했던 메소드를 컴파일러가 자동으로 만들어준다.
 * data 변경자가 붙은 클래스를 데이터 클래스라고 부른다.
 * 주 생성자 밖에 정의된 프로퍼티는 equals나 hashCode를 계산할 때 고려 대상이 아니다.
 */
data class Client2(val name: String, val postalCode: Int)

fun main() {
    val client1 = Client("김현진", 1234)
    println(client1)
    val client2 = Client("김현진", 1234)
    /**
     *  코틀린에서 == 연산자는 참조 동일성이 아니라 객체의 동등성을 검사한다.
     *  따라서 == 연산은 equals를 호출하는 식으로 컴파일 된다.
     */
    println(client1 == client2)

    val processed = hashSetOf(Client("김현진", 1234))
    println(processed.contains(Client("김현진", 1234)))

    /**
     * 데이터 클래스의 프로퍼티가 꼭 val일 필요는 없지만,
     * 모든 프로퍼티를 읽기 전용으로 만들어서 데이터 클래스를 불변 클래스로 만들라고 권장한다.
     * 다중스레드 프로그램의 경우 불변성은 중요하다.
     * 스레드가 사용 중인 데이터를 다른 스레드가 변경할 수 없으므로 스레드를 동기화해야 할 필요가 줄어든다.
     *
     * 데이터 클래스 인스턴스를 불변 객체로 더 쉽게 활용할 수 있게
     * 코틀린 컴파일러는 객체를 복사하면서 일부 프로퍼티를 바꿀 수 있게 해주는 copy 메서드를 제공한다.
     * 복사본은 원본과 다른 생명주기를 가지며, 복사본이 원본에 전혀 영향을 끼치지 않는다.
     *
     */
    val dataClass = Client2("김현진", 1234)
    println(dataClass.copy(postalCode = 9999))
}

/**
 * 자바에서는 ==를 원시 타입과 참조 타입을 비교할 때 사용한다.
 * 따라서 자바에서는 두 객체의 동등성을 알려면 equals를 호출해야 한다.
 *
 * 코틀린은 == 연산자가 내부적으로 equals를 호출해서 객체를 비교한다.
 * 참조 비교를 위해서는 === 연산자를 사용할 수 있다.
 */