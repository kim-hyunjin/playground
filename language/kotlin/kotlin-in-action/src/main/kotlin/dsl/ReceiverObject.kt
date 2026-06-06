package dsl

import kotlin.text.StringBuilder

/**
 * 수신 객체 지정 람다와 확장 함수 타입
 *
 */
fun buildString(
    builderAction: StringBuilder.() -> Unit // 수신 객체가 있는 함수 타입(확장 함수 타입)
): String {
//    val sb = StringBuilder()
//    sb.builderAction()
//    return sb.toString()
    return StringBuilder().apply(builderAction).toString()
    /*
    * apply 함수는 인자로 받은 람다나 함수를 호출하면서
    * 자신의 수신 객체를 람다나 함수의 수신객체로 사용한다.
    * */
}

fun main() {
    val s = buildString {
        append("Hello, ")
        append("World!")
    }
    println(s)
}