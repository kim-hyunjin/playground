package basic

import java.lang.Exception
import java.util.Random

fun main(args: Array<String>) {
    val name = if (args.size > 0) args[0] else "Kotlin"
    // 문자열 템플릿
    // - StringBuilder를 사용해 효율적으로 연산한다.
    // 존재하지 않는 변수를 문자열 안에서 사용하면 컴파일 오류가 발생한다.
    // 복잡한 식도 ${} 를 통해 문자열 템플릿 안에 넣을 수 있다.
    // 변수만 사용하더라도 ${}안에 넣어 사용하는 것이 좋다.
    // - 정규식 등을 통해 일괄 변환할 때나, 코드를 사람이 읽을 때 등
    println("Hello, $name!")

    // 중괄호로 둘러싼 식 안에서 큰 따음표를 사용할 수도 있다.
    println("Hello, ${if (args.size > 0) args[0] else "someone"}!")

    val person = Person("Bob", true)
    println(person.name)

    val rectangle = createRandomRectangle()
    println(rectangle.isSquare)
}

/*
* 코틀린에서 if는 식(expression)이지 문(statement)이 아니다. 식은 값을 만들어 내며
* 다른 식의 하위 요소로 계산에 참여할 수 있다.
* 반면, 문은 자신을 둘러싸고 있는 가장 안쪽 블록의 최상위 요소로 존재하며, 아무런 값을 만들어내지 못한다.
* 자바에서는 모든 제어 구조가 문인 반면,
* 코틀린에서는 루프를 제외한 대부분의 제어 구조가 식이다.
*
* 본문이 중괄호로 둘러싸인 함수를 블록이 분몬인 함수라 부른다. (block body)
* */
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}

/*
* 등호와 식으로 이루어진 함수를 식이 본문인 함수로 부른다. (expression body)
* 식이 본문인 경우 컴파일러가 타입 추론을 해준다.
*
* 블록이 본문인 경우 반드시 반환 타입을 지정하고 return 문을 사용해 반환 값을 명시해야 한다.
* */
fun min(a: Int, b: Int) = if (a > b) b else a

// 식이 본문인 함수와 마찬가지로 컴파일러가 초기화 식을 분석해 타입을 지정해주므로 타입을 명시하지 않아도 된다.
val question = "삶, 우주, 그리고 모든 것에 대한 궁극적인 질문"

fun answer() {
    // 초기화 식이 없다면 변수에 저장될 값에 대해 아무 정보가 없기 때문에 컴파일러가 타입 추론을 할 수 없다.
    // 따라서 이 경우 타입을 반드시 지정해야 한다.
    val answer: Int
    answer = 42
}

/*
* 변경 가능한 변수와 변경 불가능한 변수
* 변수 선언 시 사용하는 키워드는 두가지가 있다.
* val - 값을 뜻하는 value에서 따옴. 변경 불가능한 참조를 저장하는 변수다. val로 선언된 변수는 일단 초기화되고 나면 재대입이 불가능하다.
*       자바로 치면 final 변수.
* var - 변수를 뜻하는 variable에서 따옴. 변경 가능한 참조다. 자바의 일반 변수.
*
* 기본적으로는 모든 변수를 val 키워드를 사용해 불변 변수로 선언하고,
* 나중에 꼭 필요할 때만 var로 변경하라.
* 변경 불가능한 참조와 변경 불가능한 객체를 부수 효과가 없는 함수와 조합해 사용하면 코드가 함수형 코드에 가까워진다.
* */
fun aboutValAndVar() {
    // val 변수는 정확히 한 번만 초기화돼야 한다. 컴파일러가 이를 확인할 수 있다면 조건에 따라 초기화할 수도 있다.
    val message: String
    if (true) {
        message = "Success"
    } else {
        message = "Failed"
    }

    // val 참조 자체는 불변일지라도 그 참조가 가리키는 객체의 내부 값은 변경될 수 있다.
    val languages = arrayListOf("Java")
    languages.add("Kotlin")

    // var 키워드를 사용하면 변수의 값을 변경할 수 있지만 타입은 고정돼 바뀌지 않는다.
    var answer = 42
    // 컴파일 에러
    // answer = "no answer"
}

/*
* 클래스와 프로퍼티
* 클래스라는 개념의 목적은 데이터를 캡슐화하고 캡슐화한 데이터를 다루는 코드를 한 주체 아래 가두는 것이다.
* 자바에서는 데이터를 필드에 저장하며, 멤버 필드의 가시성은 보통 비공개(private)다.
* 클래스는 자신을 사용하는 클라이언트가 그 데이터에 접근하는 통로로 쓸 수 있는 접근자 메소드를 제공한다.
* 보통 게터(getter), 세터(setter)를 추가 제공할 수 있다.
* 자바에서는 필드와 접근자를 한데 묶어 프로퍼티라고 부른다.
*
* 코틀린은 프로퍼티를 언어 기본 기능으로 제공하며, 코틀린의 프로퍼티는 자바의 필드와 접근자 메소드를 완전히 대체한다.
* val은 읽기 전용,
* var는 변경 가능한 프로퍼티다.
* */
class Person(val name: String, var isMarried: Boolean)

// 커스텀 접근자
class Rectangle(val height: Int, val width: Int) {
    val isSquare: Boolean
    get() {
        return height == width
    }
}

fun createRandomRectangle(): Rectangle {
    val random = Random()
    return Rectangle(random.nextInt(), random.nextInt())
}

/*
* enum과 when
* enum 클래스 안에도 프로퍼티나 메소드를 정의할 수 있다.
* */
enum class Color(val r: Int, val g: Int, val b: Int) {
    // 각 상수를 생성할 때 그에 대한 프로퍼티 값을 지정한다.
    RED(255, 0 , 0),
    ORANGE(255, 165, 0),
    YELLOW(255, 255, 0),
    GREEN(0, 255, 0),
    BLUE(0, 0, 255),
    INDIGO(75, 0, 130),
    VIOLET(238, 130, 238); // 끝에 반드시 세미콜론을 사용해야 한다.

    fun rgb() = (r * 256 + g) * 256 + b
}

/*
* when
* 자바의 switch에 해당하는 코틀린 구성 요소는 when이다.
* if와 마찬가지로 when도 값을 만들어내는 식이다.
* 자바와 달리 각 분기의 끝에 break를 넣지 않아도 된다.
* */
fun getMnemonic(color: Color) =
    when (color) {
        Color.RED -> "빨"
        Color.ORANGE -> "주"
        Color.YELLOW -> "노"
        Color.GREEN -> "초"
        Color.BLUE -> "파"
        Color.INDIGO -> "남"
        Color.VIOLET -> "보"

    }

// 한 분기 안에서 여러 값을 매치 패턴으로 사용할 수도 있다. 이 경우 값 사이를 콤마(,)로 분리한다.
fun getWarmth(color: Color) = when(color) {
    Color.RED, Color.ORANGE, Color.YELLOW -> "warm"
    Color.GREEN -> "neutral"
    Color.BLUE, Color.INDIGO, Color.VIOLET -> "cold"
}

/*
* 분기 조건에 상수만을 사용할 수 있는 자바 switch와 달리
* 코틀린 when 분기 조건은 임의의 객체를 허용한다.
*
* 아래의 setOf는 여러 객체를 그 객체들을 포함하는 집합인 Set 객체로 만드는 함수
* 각 원소의 순서는 중요치 않다.
* */
fun mixColor(c1: Color, c2: Color) = when (setOf(c1, c2)) {
    setOf(Color.RED, Color.YELLOW) -> Color.ORANGE
    setOf(Color.YELLOW, Color.BLUE) -> Color.GREEN
    setOf(Color.BLUE, Color.VIOLET) -> Color.INDIGO
    else -> throw Exception("Dirty Color")
}

/*
* 인자가 없는 when 식을 사용하면 불필요한 객체 생성을 막을 수 있다.
* 코드는 약간 읽기 어려워지지만 성능을 더 향상시키기 위해 그 정도 비용을 감수해야 하는 경우도 자주 있다.
* */
fun mixColorOptimized(c1: Color, c2: Color) = when {
    (c1 == Color.RED && c2 == Color.YELLOW) || (c1 == Color.YELLOW && c2 == Color.RED) -> Color.ORANGE
    (c1 == Color.YELLOW && c2 == Color.BLUE) || (c1 == Color.BLUE && c2 == Color.YELLOW) -> Color.GREEN
    (c1 == Color.BLUE && c2 == Color.VIOLET) || (c1 == Color.VIOLET && c2 == Color.BLUE) -> Color.INDIGO
    else -> throw Exception("Dirty Color")
}