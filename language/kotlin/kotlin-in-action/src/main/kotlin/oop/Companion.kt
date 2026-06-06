package oop

/**
 * 코틀린 클래스 안에는 정적인 멤버가 없다.
 * 코틀린 언어는 자바 static 키워드를 지원하지 않는다.
 * 그 대신 코틀린에서는 패키지 수준의 최상위 함수(자바의 정적 메소드 역할을 거의 대신할 수 있다)
 * 그리고 객체 선언(object 키워드, 최상위 함수가 대신할 수 없는 역할이나 정적 필드를 대신할 수 있다)을 활용한다.
 * 대부분의 경우 최상위 함수를 활용하는 편을 더 권장한다.
 *
 * 하지만 최상위 함수는 private으로 표시된 클래스 비공개 멤버에 접근할 수 없다.
 * 그래서 클래스의 인스턴스와 관계없이 사용해야 하지만,
 * 클래스 내부 정보에 접근해야 하는 함수가 필요할 때는
 * 클래스에 중첩된 객체 선언의 멤버 함수로 정의해야 한다.
 *
 * 클래스 안에 정의된 객체 중 하나에 companion 이라는 특별한 표시를 붙이면
 * 그 클래스의 동반 객체로 만들 수 있다.
 * 이때 객체의 이름을 따로 지정할 필요가 없다.
 * 그 결과 동반 객체의 멤버를 사용하는 구문은 자바의 정적 메서드 호출이나 정적 필드 사용 구문과 같아진다.
 */
class A {
    companion object {
        fun bar() {
            println("Companion object called")
        }
    }
}

/**
 * 동반 객체는 private 생성자를 호출하기 좋은 위치다.
 * 동반 객체는 자신을 둘러싼 클래스의 모든 private 멤버에 접근할 수 있다.
 *
 * 즉, 동반 객체는 바깥쪽 클래스의 private 생성자도 호출할 수 있다.
 * 따라서 동반 객체는 팩토리 패턴을 구현하기 가장 적합한 위치다.
 */

// 부 생성자가 여럿 있는 클래스
class User6 {
    val nickname: String
    constructor(email: String) {
        nickname = email.substringBefore('@')
    }
    constructor(facebookAccountId: Int) {
        nickname = getFacebookName(facebookAccountId)
    }
}
// 부 생성자를 팩토리 메소드로 대신하기
class User7 private constructor(val nickname: String) {
    companion object {
        fun newSubscribingUser(email: String) = User7(email.substringBefore('@'))
        fun newFacebookUser(accountId: Int) = User7(getFacebookName(accountId))
    }
}

/**
 * 동반 객체는 클래스 안에 정의된 일반 객체다.
 * 따라서 동반 객체에 이름을 붙이거나, 동반 객체가 인터페이스를 상속하거나,
 * 동반 객체 안에 확장 함수와 프로퍼티를 정의할 수 있다.
 * 특별히 이름을 지정하지 않으면 동반 객체 이름은 자동으로 Companion이 된다.
 */
class Person2(val name: String) {
    companion object Loader {
        fun fromJSON(jsonText: String): Person2 = Person2(jsonText)
    }
}

interface JSONFactory<T> {
    fun fromJSON(jsonText: String): T
}

class Person3(val name: String) {
    companion object: JSONFactory<Person3> {
        override fun fromJSON(jsonText: String): Person3 {
            return Person3(jsonText)
        }
    }
}

fun <T> loadFromJSON(jsonText: String, factory: JSONFactory<T>): T {
    return factory.fromJSON(jsonText)
}

/**
 * 동반 객체 확장
 * 클래스에 동반 객체가 있으면 그 객체 안에 함수를 정의함으로써 클래스에 대해 호출할 수 있는 확장함수를 만들 수 있다.
 * 예를들어, C 라는 클래스가 있다면 C.Companion 안에 fun을 정의해 호출할 수 있다.
 */
// 비즈니스 로직 모듈
class Person4(val firstName: String, val lastName: String) {
    companion object {}
}

// 클라이언트/서버 통신 모듈
fun Person4.Companion.fromJSON(json: String): Person4 {
    return Person4(json, json)
}

/**
 * 동반 객체 안에서 fronJSON 함수를 정의한 것처럼 fromJSON을 호출할 수 있다.
 * 하지만 실제로 fronJSON은 클래스 밖에서 정의한 확장 함수다.
 * 다른 보통 확장 함수처럼 fromJSON도 클래스 멤버 함수처럼 보이지만, 실제로는 멤버함수가 아니다.
 */
val p = Person4.fromJSON("json")

fun main() {
    A.bar()

    val subscribingUser = User7.newSubscribingUser("bob@gmail.com")
    val facebookUser = User7.newFacebookUser(4)
    println(subscribingUser.nickname)
    println(facebookUser.nickname)

    // 아래 두 방법 모두 제대로 호출된다.
    val person = Person2.Loader.fromJSON("{name: 'Kim'}")
    val person2 = Person2.fromJSON("{name: 'Lee'}")
    println(person)
    println(person2)

    /*
     * Person3의 동반객체가 JSONFactory 인터페이스를 구현하고 있으므로,
     * 아래와 같이 Person3 클래스의 이름만 넘겨도 된다.
     */
    loadFromJSON("{name: 'Hyunjin'}", Person3)
}

/**
 * 클래스의 동반 객체는 일반 객체와 비슷한 방식으로,
 * 클래스에 정의된 인스턴스를 가리키는 정적 필드로 컴파일 된다.
 * 동반객체에 이름을 붙이지 않았다면 자바쪽에서 Companion 이라는 이름으로 참조에 접근할 수 있다.
 */