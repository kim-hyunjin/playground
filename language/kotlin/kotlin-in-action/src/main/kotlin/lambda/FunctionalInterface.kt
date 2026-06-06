package lambda

/**
 * 함수형 인터페이스 또는 SAM인터페이스
 * SAM은 단일 추상 메소드(Single Abstract Method)를 뜻한다.
 * 자바 API에는 Runnable이나 Callable과 같은 함수형 인터페이스와 그런 함수형 인터페이스를 활용하는 메소드가 많다.
 *
 * 코틀린은 함수형 인터페이스를 인자로 취하는 자바 메소드를 호출할 때 람다를 넘길 수 있게 해준다.
 * ex)  Runnable 인터페이스 자리에 람다를 사용할 경우,
 *      컴파일러는 자동으로 람다를 Runnable 인스턴스로 만든다.
 *      즉, Runnable을 구현한 무명 클래스의 인스턴스를 만든다.
 *      이때 그 무명 클래스에 있는 유일한 추상 메소드를 구현할 때 람다 본문을 사용한다.
 *
 *      postponeComputation(1000) { println(42) } // 프로그램 전체에서 이 Runnable의 인스턴스는 단 하나만 만들어진다.
 *      하지만 컴파일러는 람다가 주변 영역의 변수를 포획한다면 매번 새로운 인스턴스를 생성해준다.
 *      fun handleComputation(id: String) {
 *          postponeComputation(1000) { println(id) } // handleComputation을 호출할 때 마다 새로 Runnable 인스턴스를 만든다.
 *      }
 *
 * 컬렉션을 확장한 메소드에 람다를 넘기는 경우는 방식이 다르다.
 * inline으로 표시된 코틀린 함수에게 람다를 넘기면 아무런 무명클래스도 만들어지지 않는다.
 */

/**
 * SAM 생성자를 사용해 람다를 함수형 인터페이스로 명시적으로 바꾸기
 */
fun createAllDoneRunnable(): Runnable {
    // 생성하고 싶은 함수형 인터페이스 생성자로 람다를 감싼다.
    // SAM 생성자의 이름은 함수형 인터페이스의 이름과 같다.
    return Runnable { println("All Done!") }
}

fun main() {
    createAllDoneRunnable().run();
}

/**
 * 람다 안에서 this는 람다를 둘러싼 클래스의 인스턴스를 가리킨다.
 * 람다 대신 무명 객체를 사용할 경우, 무명 객체 안에서 this는 무명 객체 인스턴스 자신을 가리킨다.
 */