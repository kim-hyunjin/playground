package function.strings

import java.lang.StringBuilder

/*
* 기존 자바 API를 재작성하지 않고 코틀린이 제공하는 여러 편리한 기능을 사용할 수 있게 해주는 것이 확장함수다.
* 확장함수는 어떤 클래스의 멤버 메소드인 것처럼 호출할 수 있지만 그 클래스의 밖에 선언된 함수다.
* 함수 이름 앞에 그 함수가 확장할 클래스의 이름을 덧붙이기만 하면 된다.
*
* 클래스 이름을 수신 객체 타입(receiver type)이라 부르며, 호출되는 대상이 되는 값(객체)을 수신 객체(receiver object)라고 부른다.
*
* 자바, 코틀린, 그루비 등 다른 JVM 언어로 작성된 클래스라면 확장할 수 있다.
*
* 확장함수가 캠슐화를 깨지는 않는다. private, protected 멤버는 사용할 수 없다.
*
* 호출하는 쪽에서는 확장함수와 멤버 메소드를 구분할 수 없다. 호출하는 쪽에서 그 구분이 중요한 경우도 거의 없다.
* */
fun String.lastChar(): Char = this[this.length - 1] // this가 수신객체.

/*
* 내부적으로 확장 함수는 수신 객체를 첫 번째 인자로 받는 정적 메소드다.
*
* 자바에서는 다음과 같이 호출할 수 있다. (파일명이 StringUtil.kt인 경우)
* char c = StringUtilKt.lastChar("Java")
* */


fun <T> Collection<T>.joinToStringExtension(
    separator: String = ", ",
    prefix: String = "",
    postfix: String = ""
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in this.withIndex()) { // "this"는 수신객체. 여기서는 T 타입의 원소로 이뤄진 컬렉션이다.
        if (index > 0) result.append(separator)
        result.append(element)
    }
    result.append(postfix)
    return result.toString()
}

// 확장 함수는 단지 정적 메소드 호출에 대한 문법적인 편의(syntatic sugar)일 뿐이다.
fun Collection<String>.join(
    separator: String = ", ",
    prefix: String = "",
    postfix: String = ""
) = joinToString(separator, prefix, postfix)

// 확장 함수는 오버라이드할 수 없다.
open class View {
    open fun click() = println("View clicked")
}

class Button: View() {
    override fun click() = println("Button clicked")
}

// 실행 시점에 객체 타입에 따라 동적으로 호출될 대상 메소드를 결정
fun test() {
    val view: View = Button()
    // view에 저장된 값의 실제 타입에 따라 호출할 메소드가 결정된다.
    view.click() // Button clicked
    // 하지만 확장함수는 정적으로 결정된다.
    view.showOff() // I'm a view!
}

fun View.showOff() = println("I'm a view!")
fun Button.showOff() = println("I'm a button!")

/*
* 어떤 클래스를 확장한 함수와 그 클래스의 멤버 함수의 이름과 시그니처가 같다면 멤버 함수가 호출된다.
* 멤버 함수의 우선순위가 더 높다.
* */


/*
* 확장 프로퍼티
* 기존 클래스의 인스턴스 객체에 필드를 추가할 방법은 없다.
* 따라서 확장 프로퍼티는 아무 상태도 가질 수 없다.
* 기본 게터를 꼭 정의해야 한다. 초기화 코드도 사용할 수 없다.
* */
var StringBuilder.lastCharProperty: Char
    get() = get(length - 1)
    set(value: Char) {
        this.setCharAt(length - 1, value)
    }

fun parsePath(path: String) {
    val directory = path.substringBeforeLast("/")
    val fullName = path.substringAfterLast("/")

    val fileName = fullName.substringBeforeLast(".")
    val extension = fullName.substringAfterLast(".")

    println("Dir: $directory, name: $fileName, ext: $extension")
}

fun parsePathWithRegex(path: String) {
    // 3중 따옴표 문자열에서는 어떤 문자도 이스케이프 할 필요가 없다. 따라서 \\. 가 아니라 \.로 충분
    // 따로 지정하지 않으면 정규식 엔진은 각 패턴을 가능한 한 가장 긴 부분 문자열과 매치하려고 시도한다.
    val regex = """(.+)/(.+)\.(.+)""".toRegex()
    val matchResult = regex.matchEntire(path)
    if (matchResult != null) {
        val (directory, fileName, extension) = matchResult.destructured
        println("Dir: $directory, name: $fileName, ext: $extension")
    }
}