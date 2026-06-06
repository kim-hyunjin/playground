package basic

import java.lang.IllegalArgumentException

interface Expr
class Num(val value: Int) : Expr
class Sum(val left:Expr, val right:Expr) : Expr

// 자바 스타일
fun evalJavaStyle(e: Expr): Int {
    /*
    * 코틀린에서는 is를 사용해 변수 타입을 검사한다.
    * 자바의 instanceof와 비슷하다.
    * 자바에서 어떤 변수의 타입을 instanceof로 확인한 다음에 그 타입에 속한 멤버에 접근하기 위해서는 명시적으로 변수 타입을 캐스팅해야 한다.
    * 코틀린에서는 is로 타입을 검사하고 나면 변수를 원하는 타입으로 캐스팅 하지 않아도 된다.
    * 이를 스마트 캐스트(smart cast)이라고 부른다.
    * */
    if (e is Num) {
        val n = e as Num // 원하는 타입으로 명시적으로 캐스팅하려면 as 키워드를 사용한다.(여기서는 스마트 캐스트 되므로 사실 불필요)
        return n.value
    }
    if (e is Sum) {
        return evalJavaStyle(e.right) + evalJavaStyle(e.left) // IDE를 사용하면 스마트 캐스트 부분의 배경색을 달리 표시해준다.
    }
    throw IllegalArgumentException("Unknown expression")
}

// 코틀린 스타일
fun evalKotlinStyle(e: Expr): Int = if (e is Num) {
    e.value
} else if (e is Sum) {
    evalKotlinStyle(e.right) + evalKotlinStyle(e.left)
} else {
    throw IllegalArgumentException("Unknown expression")
} // if 분기에 식이 하나밖에 없다면 중괄호 생략가능. 블록을 사용하는 경우 그 블록의 마지막 식이 분기의 결과값이다.

// 코틀린 스타일 when사용
fun evalUseWhen(e: Expr): Int = when (e) {
    is Num -> e.value
    is Sum -> evalUseWhen(e.right) + evalUseWhen(e.left)
    else -> throw IllegalArgumentException("Unknown expression")
}

/*
* 블록의 마지막 식이 블록의 결과라는 규칙은 블록이 값을 만들어내야 하는 경우 항상 성립한다.
* 함수에 대해서는 성립하지 않는다.
* 식이 본문인 함수 - 블록을 본문으로 가질 수 없음
* 블록이 본문인 함수 - 내부에 return문이 반드시 있어야 한다.
* */