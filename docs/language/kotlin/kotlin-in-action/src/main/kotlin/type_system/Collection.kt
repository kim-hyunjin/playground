package type_system

import java.io.BufferedReader
import java.lang.NumberFormatException

/**
 * 널 가능성과 컬렉션
 */

fun readNumbers(reader: BufferedReader): List<Int?> {
    val result = ArrayList<Int?>() // 컬렉션 안의 원소가 null 일 수 있다.
    for (line in reader.lineSequence()) {
        try {
            val number = line.toInt()
            result.add(number)
        } catch (e: NumberFormatException) {
            result.add(null)
        }
    }
    return result
}

fun addValidNumbers(numbers: List<Int?>) {
    var sumOfValidNumbers = 0
    var invalidNumbers = 0
    for (number in numbers) {
        if (number != null) {
            sumOfValidNumbers += number
        } else {
            invalidNumbers++
        }
    }

    println("Sum of valid numbers : $sumOfValidNumbers")
    println("Invalid numbers: $invalidNumbers")
}

// 위 예제를 더 단순하게 만든 코드
fun addValidNumbers2(numbers: List<Int?>) {
    val validNumbers = numbers.filterNotNull() // 이때 함수가 validNumbers 에는 null이 들어있지 않음을 보장해주므로 타입은 List<Int> 다.

    println("Sum of valid numbers : ${validNumbers.sum()}")
    println("Invalid numbers: ${numbers.size - validNumbers.size}")
}

/**
 * 읽기 전용과 변경 가능한 컬렉션
 * 코틀린 컬렉션과 자바 컬렉션을 나누는 가장 중요한 특성 하나는
 * 코틀린에서는 컬렉션 안의 데이터에 접근하는 인터페이스와
 * 컬렉션 안의 데이터를 변경하는 인터페이스를 분리했다는 점이다.
 *
 * kotlin.collections.Collection 인터페이스를 사용하면
 * 컬렉션 안의 원소에 대해 이터레이션하고,
 * 컬렉션 크기롤 얻고,
 * 어떤 값이 컬렉션 안에 들어있는지 검사하고,
 * 컬렉션에서 데이터를 읽는 여러 다른 연산을 수행할 수 있다.
 * 하지만 이 안에는 원소를 추가하거나 제거하는 메소드가 없다.
 *
 * kotlin.collections.MutableCollection 인터페이스는
 * 원소를 추가하거나, 삭제하거나, 원소를 모두 지우는 등의 메소드를 더 제공한다.
 *
 * 코드에서 가능하면 항상 읽기 전용 인터페이스를 사용하는 것을 일반적인 규칙으로 삼아라.
 * 코드가 컬렉션을 변경할 필요가 있을 때만 변경 가능한 버전을 사용하라.
 */

/**
 * 함수 인자의 타입을 보면, copyElements 함수가 source 컬렉션은 변경하지 않지만, target 컬렉션을 변경하리라는 사실을 분명히 알 수 있다.
 * target에 해당하는 인자로 읽기 전용 컬렉션을 넘길 수 없다.
 *
 * 반면, 읽기 전용 타입 변수에 변경 가능한 인터페이스의 참조가 올 수 있다.
 * 또한 컬렉션을 참조하는 다른 코드를 호출하거나 병렬 실행한다면
 * 컬렉션을 사용하는 도중 다른 컬렉션이 그 컬렉션의 내용을 변경하는 상황이 생길 수 있고,
 * 이런 상황에서는 ConcurrentModificationException이나 다른 오류가 발생할 수 있다.
 * 따라서 읽기 전용 컬렉션이 항상 스레드 안전하지는 않다는 점을 명심해야 한다.
 */
fun <T> copyElements(source: Collection<T>, target: MutableCollection<T>) {
    for (item in source) {
        target.add(item)
    }
}

/**
 * 코틀린 컬렉션과 자바
 * 변경 가능한 각 인터페이스는 자신과 대응하는 읽기 전용 인터페이스를 확장(상속)한다.
 * 변경 가능한 인터페이스는 java.util 패키지에 있는 인터페이스와 직접적으로 연관되지만
 * 읽기 전용 인터페이스에는 컬렉션을 변경할 수 있는 모든 요소가 빠져있다.
 *
 * 코틀린은 java.util.ArrayList이 코틀린의 MutableList 인터페이스를 상속한 것처럼 취급한다.
 *
 * 컬렉션 생성 함수
 * 컬렉션 타입 | 읽기 전용 타입 | 변경 가능한 타입
 * List         listOf          mutableListOf, arrayListOf
 * Set          setOf           mutableSetOf, hashSetOf, linkedSetOf, sortedSetOf
 * Map          mapOf           mutableMapOf, hashMapOf, linkedMapOf, sortedMapOf
 */

/**
 * 코틀린 읽기전용 컬렉션을 자바 메소드로 넘기는 경우,
 * 자바에서는 컬렉션 안의 내용을 변경할 수 있다.
 *
 * 널이 아닌 원소로 이뤄진 컬렉션을 자바 메소드로 넘기는 경우,
 * 자바에서는 널을 컬렉션에 넣을 수도 있다.
 *
 * 따라서 코틀린 컬렉션을 자바 코드에게 넘길 때는 특별히 주의를 기울여야 한다.
 *
 */

/**
 * 컬렉션을 플랫폼 타입으로 다루기
 * 플랫폼 타입의 경우 컴파일러는 그 타입을 널이 될 수 있는 타입이나 널이 될 수 없는 타입이나 어느쪽으로든 사용할 수 있게 허용한다.
 * 또한, 읽기 전용 컬렉션이나 변경 가능한 컬렉션 어느 쪽으로든 다룰 수 있다.
 *
 * 컬렉션 타입이 시그니처에 들어간 자바 메소드 구현을 오버라이드하려는 경우 읽기 전용 컬렉션과 변경 가능 컬렉션의 차이가 문제가 될 수 있다.
 * - 컬렉션이 널이 될 수 있는가?
 * - 컬렉션의 원소가 널이 될 수 있는가?
 * - 오버라이드하는 메소드가 컬렉션을 변경할 수 있는가?
 *
 */

/**
 * 객체의 배열과 원시 타입의 배열
 * Array<Int> 타입은 자바의 java.lang.Integer[] 이다.
 *
 * 코틀린은 원시 타입의 배열을 표현하는 별도 클래스를 각 원시타입마다 하나씩 제공한다.
 * int[] 는 IntArray 이다. 또, ByteArray, CharArray, BooleanArray 등의 원시 타입 배열을 제공한다.
 *
 * 이 밖에 박싱된 값이 들어있는 컬렉션이나 배열이 있다면 toIntArray 등의 변환 함수를 사용해 언박싱된 값이 들어있는 배열로 변환할 수 있다.
 */

// 람다를 이용해 초기화
val letters = Array<String>(26) { i -> ('a' + i).toString()}

fun main(args: Array<String>) {
    for (i in args.indices) {
        println("Argument $i is: ${args[i]}")
    }

    // 코틀린 표준 라이브러리는 배열 기본 연산 외에 확장 함수도 제공한다.
    args.forEachIndexed { index, element -> println("Argument $index is: $element") }

    val source: Collection<Int> = arrayListOf(3, 5, 7)
    val target: MutableCollection<Int> = arrayListOf(1)
    copyElements(source, target)
    println(target)

    println(letters.joinToString(""))

    val strings = listOf("a", "b", "c")
    // 코틀린에서는 배열을 인자로 받는 자바 함수를 호출하거나 vararg 파라미터를 받는 코틀린 함수를 호출하기 위해 가장 자주 배열을 만든다.
    // toTypedArray 메소드를 사용하면 쉽게 컬렉션을 배열로 바꿀 수 있다.
    println("%s/%s/%s".format(*strings.toTypedArray()))

    val fiveZeros = IntArray(5)
    val fiveZerosToo = intArrayOf(0, 0, 0, 0, 0)
    println(fiveZeros.joinToString())
    println(fiveZerosToo.joinToString())

    val squares = IntArray(5) { i -> (i+1) * (i+1)}
    println(squares.joinToString())

}