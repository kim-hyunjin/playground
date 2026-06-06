package oop

import java.io.Serializable

/**
 * 내부 클래스와 중첩된 클래스
 * 도우미 클래스를 캡술화하거나 코드 정의를 그 코드를 사용하는 곳 가까이에 두고 싶을때 내부 클래스가 유용하다.
 * 자바와의 차이는 명시적으로 요청하지 않는 한 내부 클래스가 바깥 클래스 인스턴스에 대한 접근 권한이 없다는 점이다.
 */

interface State: Serializable
interface View {
    fun getCurrentState(): State
    fun restoreState(state: State) {}
}

class Button2: View {
    override fun getCurrentState(): State = ButtonState()
    override fun restoreState(state: State) {
        /**/
    }

    // 코틀린 중첩 클래스에 아무런 변경자가 붙이 않으면 자바의 static 중첩 클래스와 같다.
    class ButtonState: State {/**/}
}

class Outer {
    // 내부클래스에서 바깥쪽 클래스를 참조하려면 inner 변경자를 붙여야 한다.
    inner class Inner {
        // 바깥쪽 클래스를 참조하려면 아래와 같이 한다.
        fun getOuterReference(): Outer = this@Outer
    }
}