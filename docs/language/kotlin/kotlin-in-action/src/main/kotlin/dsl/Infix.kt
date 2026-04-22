package dsl

import java.lang.AssertionError

/**
 * 중위 호출 연쇄
 */

interface Matcher<T> {
    fun test(value: T)
}

infix fun <T> T.should(matcher: Matcher<T>) = matcher.test(this)

class startWith(val prefix: String) : Matcher<String> {
    override fun test(value: String) {
        if(!value.startsWith(prefix)) {
            throw AssertionError("String $value does not start with $prefix")
        }
    }
}

/**
 * should 메소드를 오버로딩
 * DSL 문법을 정의하기 위해 object 사용
 */
object start
infix fun String.should(x: start): StartWrapper = StartWrapper(this)

class StartWrapper(val value: String) {
    infix fun with(prefix: String): Unit {
        if(!value.startsWith(prefix)) {
            throw AssertionError("String $value does not start with $prefix")
        } else {
            return Unit
        }
    }
}


fun main() {
    val s = "kotlin"
    s should startWith("kot")

    "kotlin" should start with "kot"
}