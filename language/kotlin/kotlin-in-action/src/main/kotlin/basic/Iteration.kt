package basic

import java.util.*

/*
* 코틀린 특성 중 자바와 가장 비슷한 것이 이터레이션이다.
* while, do-while은 자바와 동일
* for는 자바의 for-each 루프에 해당하는 형태만 존재한다.
* - for <아이템> in <원소들> 형태를 취한다.
* 이런 for 루프는 자바에서와 마찬가지로 컬렉셔넹 대한 이터레이션에 가장 많이 쓰인다.
*
* 흔한 용례인 초깃값, 증가 값, 최종 값을 사용한 루프를 대신하기 위해 코틀린에서는 범위(range)를 사용한다.
* val oneToTen = 1..10 // ..연산자로 시작값과 끝값을 연결해서 범위를 만든다.
* 코틀린의 범위는 양끝을 포함하는 구간이다.
*
* 끝값을 포함하지 않는 반만 닫힌 구간을 만들고 싶다면 until을 사용
* */
fun fizzbuzz(i: Int) = when {
    i % 15 == 0 -> "FizzBuzz"
    i % 3 == 0 -> "Fizz"
    i % 5 == 0 -> "Buzz"
    else -> "$i"
}

val binaryReps = TreeMap<Char, String>() // 키에 대해 정렬하기 위해 TreeMap 사용

fun mapIterateExam() {
    // A부터 F까지 문자의 범위를 사용해 이터레이션한다.
    for (c in 'A'..'F') {
        val binary = Integer.toBinaryString(c.code) // 아스키 코드를 2진 표현으로 바꾼다.
        binaryReps[c] = binary // binaryReps.put(c, binary)
    }

    for ((letter, binary) in binaryReps) { // 구조 분해 문법
        println("$letter = $binary")
    }
}

fun listIterateExam() {
    val list = arrayListOf("10", "11", "1001")
    for ((index, element) in list.withIndex()) {
        println("$index: $element")
    }
}

// in 연산자를 사용해 어떤 값이 범위에 속하는지 검사할 수 있다.
fun isLetter(c: Char) = c in 'a'..'z' || c in 'A'..'Z'
fun isNotDigit(c: Char) = c !in '0'..'9'
fun recognize(c: Char) = when (c) {
    in '0'..'9' -> "It's a digit!"
    in 'a'..'z', in 'A'..'Z' -> "It's a letter!"
    else -> "I don't know..."
}
fun main() {
    for (i in 1..100) {
        print(fizzbuzz(i))
    }

    //  downTo 는 역방향 수열을 만든다. step 다음의 수가 증가값의 절대값이 된다.(역방향 수열의 경우 기본 증가값은 -1. 여기선 -2)
    for (i in 100 downTo 1 step 2) {
        print(fizzbuzz(i))
    }

    mapIterateExam()
    listIterateExam()

    println(isLetter('q'))
    println(isNotDigit('x'))
    println(recognize('8'))

    // java.lang.Comparable 인터페이스를 구현한 클래스라면 그 클래스의 인스턴스 객체를 사용해 범위를 만들 수 있다.
    println("Kotlin" in "Java".."Scala") // 알파벳 순서로 비교. "Java" <= "Kotlin" && "Kotlin" <= "Scala"와 같다.
    println("Kotlin" in setOf("Java", "Scala")) // false. 이 집합에는 "Kotlin"이 들어있지 않다.
}