package oop

// 기반 클래스를 sealed로 봉인. sealed로 표시된 클래스는 자동으로 open이다.
sealed class Expr {
    // 기반 클래스의 모든 하위 클래스를 중첩 클래스로 나열한다.
    class Num(val value: Int): Expr()
    class Sum(val left: Expr, val right: Expr): Expr()
}

// when식이 하위 클래스를 모두 검사하므로 별도의 else 분기가 없어도 된다.
fun eval(e: Expr): Int = when (e) {
    is Expr.Num -> e.value
    is Expr.Sum -> eval(e.left) + eval(e.right)
}