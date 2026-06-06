package oop

/**
 *    변경자  |   클래스 멤버    |   최상위 선언  |
 * public       모든 곳에서 볼 수 있다.
 * internal     같은 모듈 안에서만 볼 수 있다.
 * protected    하위 클래스 안  | (적용할 수 없음)
 * private      같은 클래스 안  | 같은 파일 안
 *
 * 자바의 기본 가시성인 패키지 전용은 코틀린에 없다.
 * 코틀린은 패키지를 네임스페이스를 관리하기 위한 용도로만 사용한다.
 * 대신 internal이라는 모듈 가시성이 있는데,
 * 모듈은 한 번에 한꺼번에 컴파일되는 코틀린 파일들을 의미한다.
 */

internal open class TalkactiveButton: Focusable {
    private fun yell() = println("Hey!")
    protected fun whisper() = println("Let's talk!")
}

/*
fun TalkactiveButton.giveSpeech() { // public 사용 불가 - internal을 노출함
    yell() // private이라 접근 불가
    whisper() // protected라 접근 불가
}

protected 멤버는 오직 그 클래스와 그 클래스를 상속한 클래스 안에서만 보인다.
클래스를 확장한 함수는 private이나 protected 멤버에 접근할 수 없다.

자바에서 사용시
자바에서는 클래스를 private으로 만들 수 없으므로, 내부적으로 코틀린은 private 클래스를 패키지-전용 클래스로 컴파일 한다.
자바에는 internal에 딱 맞는 가시성이 없다. 따라서 internal 변경자는 바이트코드상에서는 public이 된다.
이때 코틀린 컴파일러가 internal 멤버의 이름을 보기 나쁘게 바꾼다.
- 한 모듈에 속한 클래스를 모듈 밖에서 상속한 경우,
  메소드 이름이 우연히 상위 클래스의 메소드와 같아져서 의도치않게 오버라이드하는 경우를 막기 위함
- 또한 실수로 internal 클래스를 모듈 외부에서 사용하는 일을 막기 위함.

코틀린 선언과 자바 선언의 차이 때문에 코틀린에서는 접근할 수 없는 대상을 자바에서 접근할 수 있는 경우가 생긴다.

 */

/**
 * 접근자의 가시성 변경
 * 접근자의 가시성은 기본적으로 프로퍼티의 가시성과 같다.
 * 하지만 원한다면 get이나 set앞에 가시성 변경자를 추가해서 접근자의 가시성을 변경할 수 있다.
 *
 */
class LengthCounter {
    var counter: Int = 0
        private set // 이 클래스 밖에서 이 프로퍼티의 값을 바꿀 수 없다.

    fun addWord(word: String) {
        counter += word.length
    }
}

fun main() {
    val lengthCounter = LengthCounter()
    lengthCounter.addWord("Hi!")
    println(lengthCounter.counter)
}