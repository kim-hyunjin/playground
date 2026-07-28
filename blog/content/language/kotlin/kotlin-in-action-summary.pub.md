---
title: "[Kotlin in Action 00] 코틀린 핵심 문법과 함수"
description: "Kotlin in Action 실습 저장소의 기본 문법, 제어 흐름, 함수, 확장 함수를 실행 가능한 예제로 설명하는 시리즈 입문 글"
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - Functions
  - ExtensionFunctions
  - ControlFlow
summary: "Kotlin in Action 실습 코드를 바탕으로 식, 스마트 캐스트, 반복, 함수, 확장 함수를 단계별로 익힙니다."
---

이 글은 저장소의 `src/main/kotlin`이나 `summary.md`를 따로 열지 않아도 실습의 흐름을 따라갈 수 있도록 만든 **Kotlin in Action 시리즈의 출발점**입니다. 저장소가 Kotlin 1.5.10과 JVM 11을 기준으로 작성되어 있다는 점을 감안해, 예제의 학습 의도를 유지하면서 핵심 코드만 실행 가능한 단위로 정리했습니다.

## 먼저 잡아야 할 관점: 문이 아니라 식

코틀린에서는 `if`, `when`, `try`가 값을 만듭니다. 그래서 값을 구하는 로직과 반환 로직을 따로 쓸 필요가 없습니다.

```kotlin
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}

fun min(a: Int, b: Int) = if (a < b) a else b

fun parseNumber(text: String): Int? =
    try {
        text.toInt()
    } catch (e: NumberFormatException) {
        null
    }
```

중괄호가 있는 블록도 마지막 식이 결과가 됩니다. 다만 블록 본문 함수는 반환 타입과 `return`을 명시해야 합니다. 위 `min`처럼 등호 뒤에 식을 둔 함수에서는 컴파일러가 반환 타입을 추론합니다.

## `val`을 기본값으로 삼기

`val`은 참조를 다시 대입할 수 없고, `var`는 다시 대입할 수 있습니다.

```kotlin
val languages = arrayListOf("Java")
languages.add("Kotlin") // 참조는 같고, 가리키는 객체는 변경된다.

var answer = 42
answer = 43
// answer = "forty-two" // 타입은 바뀌지 않는다.
```

`val`이 객체까지 불변으로 만드는 것은 아닙니다. 그럼에도 재대입이 필요한 시점까지 `val`을 유지하면 값이 어디에서 바뀌는지 추적할 범위가 크게 줄어듭니다.

## 프로퍼티와 문자열 템플릿

코틀린의 프로퍼티는 필드와 접근자를 한 문법으로 표현합니다. `val`은 읽기 전용, `var`는 변경 가능한 프로퍼티입니다.

```kotlin
class Person(
    val name: String,
    var isMarried: Boolean,
)

class Rectangle(
    val height: Int,
    val width: Int,
) {
    val isSquare: Boolean
        get() = height == width
}

fun greet(person: Person) {
    println("Hello, ${person.name}!")
}
```

`isSquare`는 별도 값을 저장하지 않고 접근할 때마다 계산합니다. 자바에서 게터를 직접 호출하던 코드가 프로퍼티 접근으로 읽히지만, 필요하면 커스텀 게터와 세터를 그대로 정의할 수 있습니다.

## `when`과 스마트 캐스트

`when`은 자바의 `switch`보다 넓은 조건을 받을 수 있고 결과도 반환합니다.

```kotlin
enum class Color { RED, ORANGE, YELLOW, GREEN, BLUE }

fun warmth(color: Color) = when (color) {
    Color.RED, Color.ORANGE, Color.YELLOW -> "warm"
    Color.GREEN -> "neutral"
    Color.BLUE -> "cold"
}
```

타입 계층을 다룰 때는 `is` 검사 뒤에 명시적 캐스트가 필요 없습니다.

```kotlin
sealed interface Expr
data class Num(val value: Int) : Expr
data class Sum(val left: Expr, val right: Expr) : Expr

fun eval(expr: Expr): Int = when (expr) {
    is Num -> expr.value
    is Sum -> eval(expr.left) + eval(expr.right)
}
```

`expr is Num`인 분기에서 컴파일러는 `expr`을 `Num`으로 스마트 캐스트합니다. `sealed` 계층의 모든 경우를 처리했기 때문에 `else`도 필요 없습니다.

## 범위와 반복

코틀린의 `for`는 컬렉션이나 범위를 순회합니다.

```kotlin
fun fizzBuzz(i: Int) = when {
    i % 15 == 0 -> "FizzBuzz"
    i % 3 == 0 -> "Fizz"
    i % 5 == 0 -> "Buzz"
    else -> i.toString()
}

for (i in 1..100) {
    print("${fizzBuzz(i)} ")
}

for (i in 100 downTo 1 step 2) {
    print("${fizzBuzz(i)} ")
}
```

- `1..100`은 양 끝을 포함합니다.
- `until`은 끝값을 포함하지 않습니다.
- `downTo`는 역방향, `step`은 간격을 지정합니다.
- `in`과 `!in`은 범위나 컬렉션의 포함 여부를 검사합니다.

```kotlin
fun recognize(c: Char) = when (c) {
    in '0'..'9' -> "digit"
    in 'a'..'z', in 'A'..'Z' -> "letter"
    else -> "unknown"
}
```

맵과 리스트를 순회할 때 구조 분해를 함께 쓸 수 있습니다.

```kotlin
val binary = sortedMapOf('A' to "1000001", 'B' to "1000010")

for ((letter, representation) in binary) {
    println("$letter = $representation")
}

for ((index, element) in listOf("10", "11", "1001").withIndex()) {
    println("$index: $element")
}
```

## 함수의 기본 인자와 이름 붙인 인자

기본 인자를 사용하면 인자 조합마다 오버로드를 만들 필요가 없습니다.

```kotlin
fun <T> joinToString(
    collection: Collection<T>,
    separator: String = ", ",
    prefix: String = "",
    postfix: String = "",
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in collection.withIndex()) {
        if (index > 0) result.append(separator)
        result.append(element)
    }
    return result.append(postfix).toString()
}

val values = listOf(1, 7, 53)

println(joinToString(values))
println(joinToString(values, separator = "; ", prefix = "(", postfix = ")"))
println(joinToString(values, prefix = "#"))
```

이름 붙인 인자는 의미가 불분명한 문자열이나 불리언 인자가 연속될 때 특히 유용합니다. 자바에서 기본 인자 형태의 코틀린 함수를 편하게 호출해야 한다면 `@JvmOverloads`로 오버로드 생성을 요청할 수 있습니다.

## 최상위 함수와 확장 함수

코틀린 함수는 클래스 밖 파일 최상위에 둘 수 있습니다. 특정 타입의 공개 API를 멤버처럼 호출하고 싶다면 확장 함수를 사용합니다.

```kotlin
fun String.lastChar(): Char = this[length - 1]

fun <T> Collection<T>.join(
    separator: String = ", ",
    prefix: String = "",
    postfix: String = "",
): String {
    val result = StringBuilder(prefix)
    for ((index, element) in withIndex()) {
        if (index > 0) result.append(separator)
        result.append(element)
    }
    return result.append(postfix).toString()
}

println("Kotlin".lastChar())
println(listOf("one", "two", "three").join(" "))
```

확장 함수는 클래스 내부에 새 멤버를 삽입하지 않습니다. JVM에서는 수신 객체를 첫 인자로 받는 정적 함수와 같은 형태로 컴파일되며, 다음 제약이 생깁니다.

- 수신 객체의 `private`, `protected` 멤버에는 접근할 수 없습니다.
- 확장 함수 호출은 변수의 **정적 타입**으로 결정되므로 오버라이드되지 않습니다.
- 같은 시그니처의 멤버 함수가 생기면 멤버 함수가 우선합니다.

확장 프로퍼티도 상태를 저장할 수 없으므로 접근자를 정의해야 합니다.

```kotlin
var StringBuilder.lastChar: Char
    get() = get(length - 1)
    set(value) {
        setCharAt(length - 1, value)
    }
```

## 로컬 함수로 검증 중복 걷어내기

함수 안의 작은 반복 로직은 로컬 함수로 뽑을 수 있고, 로컬 함수는 바깥 함수의 파라미터를 사용할 수 있습니다.

```kotlin
data class User(val id: Int, val name: String, val address: String)

fun User.validateBeforeSave() {
    fun validate(value: String, fieldName: String) {
        require(value.isNotEmpty()) {
            "Can't save user $id: empty $fieldName"
        }
    }

    validate(name, "Name")
    validate(address, "Address")
}
```

한 객체의 공개 정보만 사용하는 보조 로직이라면 확장 함수로 분리하면 원래 클래스를 간결하게 유지할 수 있습니다. 로컬 함수를 여러 단계 중첩하면 읽기 어려워지므로 보통 한 단계면 충분합니다.

## 직접 실행해 볼 체크리스트

1. `eval(Sum(Num(1), Num(2)))`가 `3`을 반환하는지 확인합니다.
2. `1..10`, `1 until 10`, `10 downTo 1 step 2`의 원소 차이를 출력합니다.
3. `joinToString`의 기본 인자를 하나씩 생략해 봅니다.
4. `lastChar`와 같은 이름의 멤버 함수를 가진 클래스를 만들고 무엇이 우선하는지 확인합니다.

## 시리즈 읽는 순서

| 회차 | 주제 | 글 |
|---|---|---|
| 00 | 핵심 문법과 함수 | [코틀린 핵심 문법과 함수](./kotlin-in-action-summary.pub.md) |
| 01 | 타입 시스템 | [널 안전성, 컬렉션과 타입](./01-type-system.pub.md) |
| 02 | 함수형 코드 | [람다, 컬렉션과 시퀀스](./02-lambdas-collections-sequences.pub.md) |
| 03 | 객체 모델 | [클래스, 위임과 객체](./03-classes-delegation-objects.pub.md) |
| 04 | 추상화 | [고차 함수, 인라인과 제네릭](./04-higher-order-functions-generics.pub.md) |
| 05 | 언어 관례 | [연산자, 구조 분해와 프로퍼티 위임](./05-conventions-and-property-delegation.pub.md) |
| 06 | 메타프로그래밍 | [DSL, 애노테이션과 리플렉션](./06-dsl-annotations-reflection.pub.md) |

다음 글에서는 `String?`와 `String`의 차이부터 컬렉션의 변경 가능성, `Any`·`Unit`·`Nothing`까지 타입 시스템을 코드로 연결합니다.
