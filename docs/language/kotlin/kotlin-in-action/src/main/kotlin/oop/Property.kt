package oop

/**
 * 코틀린에서는 인터페이스에 추상 프로퍼티 선언을 넣을 수 있다.
 *
 * 아래는 User3 인터페이스를 구현하는 클래스가 nickname의 값을 얻을 수 있는 방법을 제공해야 한다는 뜻이다.
 */
interface User3 {
    val nickname: String
}

class PrivateUser(override val nickname: String): User3 // 주 생성자에서 User3의 추상 프로퍼티 구현

class SubscribingUser(val email: String): User3 {
    override val nickname: String
        get() = email.substringBefore('@') // 커스텀 게터로 프로퍼티 설정 필드에 값을 저장X 매번 계산해서 반환
}

class FacebookUser(val accountId: Int): User3 {
    override val nickname = getFacebookName(accountId) // 프로퍼티 초기화식
}

fun getFacebookName(accountId: Int): String {
    return "nicknameFindBy$accountId"
}

/**
 * 추상 프로퍼티뿐 아니라 게터와 세터가 있는 프로퍼티를 선언할 수 있다.
 * 아래의 경우 하위 클래스는 추상 프로퍼티인 email을 반드시 오버라이드해야 한다.
 * 반면 nickname은 오버리아드하지 않고 상속할 수 있다.
 */
interface User4 {
    val email: String
    val nickname: String
        get() = email.substringBefore('@')
}

fun main() {
    println(PrivateUser("test@kotlinlang.org").nickname)
    println(SubscribingUser("test@kotlinlang.org").nickname)
}

/**
 * lateinit 변경자를 널이 될 수 없는 프로퍼티에 지정하면 프로퍼티 생성자가 호출된 다음에 초기화한다는 뜻이다.
 * 일부 프레임워크에서는 이런 특성이 꼭 필요하다.
 *
 * 요청이 들어오면 비로소 초기화되는 지연 초기화(lazy initialized) 프로퍼티는 더 일반적인 위임 프로퍼티의 일종이다.
 *
 * 자바 프레임워크와의 호환성을 위해 자바의 특징을 코틀린에서 에뮬레이션하는 애노테이션을 활용할 수 있다.
 * @JvmField 애노테이션을 프로퍼티에 붙이면 접근자가 없는 public 필드를 노출시켜준다.
 * const 변경자를 사용하면 애노테이션을 더 편리하게 다룰 수 있고 원시 타입이나 String 타입인 값을 애노테이션의 인자로 활용할 수 있다.
 */