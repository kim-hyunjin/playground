package lambda

import java.lang.StringBuilder

/**
 * with와 apply는 코틀린 표준 라이브러리의 함수다.
 * 수신 객체를 명시하지 않고 람다의 본문 안에서 다른 객체의 메소드를 호출할 수 있게 한다.
 * 그런 람다를 수신 객체 지정 람다 라고 부른다.
 *
 * with문은 실제로는 파라미터가 2개 있는 함수다.
 */

fun alphabet() : String {
//    val result = StringBuilder()
//    for (letter in 'A'..'Z') {
//        result.append(letter);
//    }
//    result.append("\nNow I know the alphabet!")
//    return result.toString();
    val stringBuilder = StringBuilder()
    // 수신 객체 지정
    // 첫번째 파라미터가 stringBuilder, 두번째 파라미터가 람다.
    return with(stringBuilder) {
        for (letter in 'A'..'Z') {
            this.append(letter) // this 를 명시해서 앞에서 지정한 수신객체의 메소드를 호출
        }
        append("\nNow I know the alphabet!") // this 생략 가능
        this.toString()
    }
}

// with식을 본문으로 하는 함수
fun alphabet2() = with(StringBuilder()) {
    for (letter in 'A'..'Z') {
        append(letter) // this 를 명시해서 앞에서 지정한 수신객체의 메소드를 호출
    }
    append("\nNow I know the alphabet!") // this 생략 가능
    toString()
}

/**
 * apply 함수는 with와 거의 같다.
 * 다만, apply는 항상 자신에게 전달된 객체를 반환한다는 점이 다르다.
 *
 * apply는 확장 함수로 정의돼 있다.
 *
 * 이런 apply 함수는 객체의 인스턴스를 만들면서 즉시 프로퍼티 중 일부를 초기화해야 하는 경우 유용하다.
 * 자바에서는 보통 Builder 객체가 이런 역할을 담당한다.
 */
fun alphabet3() = StringBuilder().apply {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
}.toString();

// buildString 사용 예
fun alphabet4() = buildString {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
}

fun main() {
    alphabet();
    alphabet2();
    alphabet3();
    alphabet4();
}

/**
 * 수신 객체 지정 람다는 DSL 정의에 사용할 때에도 매우 유용하다.
 */