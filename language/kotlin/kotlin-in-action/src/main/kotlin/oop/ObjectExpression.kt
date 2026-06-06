package oop

import java.awt.Window
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

/**
 * object 키워드를 싱글턴과 같은 객체를 정의하고
 * 그 객체에 이름을 붙일 때만 사용하지는 않는다.
 * 무명 객체를 정의할 때도 object 키워드를 쓴다.
 * 무명 객체는 자바의 무명 내부 클래스를 대신한다.
 *
 * 객체 식은 클래스를 정의하고 그 클래스에 속한 인스턴스를 생성하지만,
 * 그 클래스나 인스턴스에 이름을 붙이지는 않는다.
 * 이런 경우 보통 함수를 호출하면서 인자로 무명 객체를 넘기기 때문에 클래스와 인스턴스 모두 이름이 필요하지 않다.
 * 하지만 객체에 이름을 붙여야 한다면 변수에 무명 객체를 대입하면 된다.
 *
 * 한 인터페이스만 구현하거나 한 클래스만 확장할 수 있는 자바의 무명 내부 클래스와 달리
 * 코틀린 무명 클래스는 여러 인터페이스를 구현하거나 클래스를 확장하면서 인터페이스를 구현할 수 있다.
 *
 * 객체 선언과 달리 무명 객체는 싱글턴이 아니다. 객체 식이 쓰일 때마다 새로운 인스턴스가 생성된다.
 */
val listener = object: MouseAdapter() {
        override fun mouseClicked(e: MouseEvent?) {
            super.mouseClicked(e)
        }

        override fun mouseEntered(e: MouseEvent?) {
            super.mouseEntered(e)
        }
    }

/**
 * 자바의 무명 클래스와 같이 객체 식 안의 코드는 그 식이 포함된 함수의 변수에 접근할 수 있다.
 * 자바와 달리 final이 아닌 변수도 객체 식 안에서 사용할 수 있다.
 * 따라서 객체 식 안에서 그 변수의 값을 변경할 수 있다.
 */
fun countClicks(window: Window) {
    var clickCount = 0
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent?) {
            clickCount++
        }
    })
}

/**
 * 객체 식은 무명 객체 안에서 여러 메소드를 오버라이드해야 하는 경우에 훨씬 더 유용하다.
 * 메소드가 하나뿐인 인터페이스(Runnable 등의 인터페이스)를 구현해야 한다면
 * 코틀린의 SAM 변환 지원을 활용하는 편이 낫다.
 * SAM 변환을 사용하려면 무명 객체 대신 함수 리터럴(람다)을 사용해야 한다.
 *
 * SAM : 추상 메소드가 하나만 있는 인터페이스.
 *  자바에서 Runnable, Comparator, Callable, ActionListener 등 상당수의 인터페이스가 SAM이다.
 *  다른 말로 함수형 인터페이스라고 부른다.
 *  자바 8에 도입된 자바 람다를 SAM 인터페이스를 구현하는 무명 클래스 대신 사용할 수 있다.
 */