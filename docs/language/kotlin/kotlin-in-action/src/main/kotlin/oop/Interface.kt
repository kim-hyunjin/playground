package oop

/**
* 코틀린 인터페이스 안에는 추상 메소드뿐 아니라 구현이 있는 메소드도 정의할 수 있다.(자바 8의 디폴트 메소드와 비슷)
* 다만 인터페이스에는 아무런 상태(필드)도 들어갈 수 없다.
* */
interface Clickable {
    fun click()
    // 특별한 키워드 없이 메소드 본문을 메소드 시그니처 뒤에 추가하면 디폴트 구현을 제공할 수 있다.
    fun showOff() = println("I'm clickable!")
}

interface Focusable {
    fun setFocus(b: Boolean) = println("I ${if (b) "got" else "lost"} focus.")
    fun showOff() = println("I'm focusable!")
}

/**
* 자바와 마찬가지로 클래스는 인터페이스를 원하는 만큼 개수 제한 없이 구현할 수 있지만,
* 클래스는 오직 하나만 확장할 수 있다.
* */
class Button: Clickable, Focusable {
    // 자바와 달리 override 변경자를 꼭 사용해야 한다.
    override fun click() = println("I was clicked")

    // 상위 인터페이스 두 개가 동일한 디폴트 메소드를 제공하고 있어 반드시 오버라이드 해야 한다.
    override fun showOff() {
        // 상위 타입의 이름을 <> 사이에 넣어서 super를 지정하면 어떤 상위 타입의 멤버 메소드를 호출할지 지정할 수 있다.
        // 자바에서는 Clickable.super.showOff() 이지만 코틀린에서는 super<Clickable>.showOff()
        super<Clickable>.showOff()
        super<Focusable>.showOff()
    }
}

fun main() {
    val button = Button()
    button.showOff()
    button.setFocus(true)
    button.click()
}

/**
 * 자바에서 코틀린의 메소드가 있는 인터페이스 구현
 * 코틀린은 자바6와 호환되게 설계됐다. 따라서 인터페이스의 디폴트 메소드를 지원하지 않는다.
 * 코틀린은 디폴트 메소드가 있는 인터페이스를 일반 인터페이스와 디폴트 메소드가 정적 메소드로 들어있는 클래스를 조합해 구현한다.
 * 그러므로 자바에서 코틀린 인터페이스를 상속해 구현하고 싶다면 모든 메소드에 대한 본문을 작성해야 한다.
 * (즉 코틀린의 디폴트 메소드 구현에 의존할 수 없다)
 */