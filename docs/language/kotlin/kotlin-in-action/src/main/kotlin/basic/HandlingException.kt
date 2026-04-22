package basic

import java.io.BufferedReader
import java.io.StringReader
import java.lang.NumberFormatException

/*
* 코틀린의 예외 처리는 자바나 다른 언어의 예외 처리와 비슷하다.
* 함수는 오류가 발생하면 예외를 던질 수 있다. 함수를 호출하는 쪽에서는 그 예외를 잡아 처리할 수 있다.
* 발생한 예외를 호출 단에서 처리하지 않으면 함수 호출 스택을 거슬러 올라가면서 예외를 처리하는 부분이 나올 때까지 다시 던진다(rethrow)
*
* 자바 코드와 큰 차이는 throws절이 없다는 점이다.
* 자바에서는 체크 예외(checked exception)를 명시적으로 처리해야 한다. 함수가 던질 가능성이 있는 예외는 throws절에 명시해야 한다.
*
* 코틀린은 체크 예외와 언체크 예외를 구별하지 않는다. 함수가 던지는 예외를 지정하지 않고 발생한 예외를 잡아내도 되고 잡아내지 않아도 된다.
* */
fun readNumber(reader: BufferedReader): Int? {
    try {
        val line = reader.readLine()
        return Integer.parseInt(line)
    } catch (e: NumberFormatException) {
        return null
    } finally {
        /*
        * BufferedReader.close는 IOException을 던질 수 있는데,
        * 그 예외는 체크 예외이므로 자바에서는 반드시 처리해야 한다.
        * 하지만 실제 스트림을 닫다가 실패하는 경우 특별히 스트림을 사용하는 클라이언트 프로그램이 취할 수 있는 의미 있는 동작은 없다.
        * 그러므로 이 IOException을 잡아내는 코드는 그냥 불필요하다.
        * */
        reader.close()
    }
}

/*
* try를 식으로 사용하기
* if와 달리 try는 반드시 중괄호로 둘러싸야 한다.
* try의 본문도 마지막 식의 값이 결과값이다.
* */
fun readNumberWithExpression(reader: BufferedReader) {
    val number = try {
        Integer.parseInt(reader.readLine())
    } catch (e: NumberFormatException) {
        null // catch 블록도 값을 만들 수 있다.
    }
    println(number)
}

fun main() {
    val reader = BufferedReader(StringReader("239"))
    println(readNumber(reader))

    val notANumber = BufferedReader(StringReader("not a number"))
    readNumberWithExpression(notANumber)
}