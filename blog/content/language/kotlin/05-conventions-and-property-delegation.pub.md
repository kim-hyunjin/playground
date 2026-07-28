---
title: "[Kotlin in Action 05] 연산자, 구조 분해와 프로퍼티 위임"
description: "코틀린 관례에 따른 연산자 오버로딩, get/set/in, iterator, 구조 분해, lazy와 프로퍼티 위임을 예제로 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - OperatorOverloading
  - DelegatedProperties
  - Conventions
summary: "특정 이름의 함수가 코틀린 문법으로 연결되는 원리와 프로퍼티 위임으로 상태 로직을 재사용하는 법을 익힙니다."
---

코틀린의 여러 문법은 특정 인터페이스가 아니라 **정해진 이름의 함수**와 연결됩니다. `plus`를 정의하면 `+`, `get`을 정의하면 `[]`를 쓸 수 있는 식입니다. 이를 관례(convention)라고 합니다.

## 산술 연산자

```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point): Point =
        Point(x + other.x, y + other.y)
}

operator fun Point.times(scale: Double): Point =
    Point((x * scale).toInt(), (y * scale).toInt())

operator fun Char.times(count: Int): String =
    toString().repeat(count)

println(Point(10, 20) + Point(30, 40))
println(Point(10, 20) * 1.5)
println('a' * 3)
```

`operator`는 이 함수가 언어 관례에 참여한다는 사실을 명시합니다. 피연산자와 반환 타입이 같을 필요는 없지만, 코틀린이 교환 법칙까지 만들어 주지는 않습니다. `point * 1.5`를 정의했다고 `1.5 * point`가 자동으로 생기지는 않습니다.

대표적인 대응은 다음과 같습니다.

| 식 | 함수 |
|---|---|
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `-a` | `a.unaryMinus()` |
| `a++` | `a.inc()` |

## 비교 연산자

`==`는 널을 안전하게 처리하며 `equals`로 변환됩니다. 참조 동일성은 `===`로 검사합니다.

순서 비교는 `compareTo`로 연결됩니다.

```kotlin
data class Person(
    val firstName: String,
    val lastName: String,
) : Comparable<Person> {
    override fun compareTo(other: Person): Int =
        compareValuesBy(
            this,
            other,
            Person::lastName,
            Person::firstName,
        )
}

println(Person("Alice", "Smith") > Person("Bob", "Johnson"))
```

`<`, `>`, `<=`, `>=`는 `compareTo` 결과와 0을 비교합니다.

## 인덱스 접근과 포함 검사

```kotlin
operator fun Point.get(index: Int): Int = when (index) {
    0 -> x
    1 -> y
    else -> throw IndexOutOfBoundsException("$index")
}

data class MutablePoint(var x: Int, var y: Int)

operator fun MutablePoint.set(index: Int, value: Int) {
    when (index) {
        0 -> x = value
        1 -> y = value
        else -> throw IndexOutOfBoundsException("$index")
    }
}

val point = Point(10, 20)
println(point[1])

val mutable = MutablePoint(10, 20)
mutable[1] = 42
```

`in`은 오른쪽 객체의 `contains`를 호출합니다.

```kotlin
data class Rectangle(
    val upperLeft: Point,
    val lowerRight: Point,
)

operator fun Rectangle.contains(point: Point): Boolean =
    point.x in upperLeft.x until lowerRight.x &&
        point.y in upperLeft.y until lowerRight.y

val area = Rectangle(Point(10, 20), Point(50, 50))
println(Point(20, 30) in area)
```

여기서는 오른쪽과 아래쪽 경계를 제외하도록 `until`을 썼습니다. 도메인 경계 규칙이 연산자 구현에 드러나야 합니다.

## 범위와 반복 관례

`..`는 `rangeTo`, `for`는 `iterator` 관례를 사용합니다. 기존 타입에도 확장 함수로 관례를 붙일 수 있습니다.

```kotlin
operator fun ClosedRange<java.time.LocalDate>.iterator():
    Iterator<java.time.LocalDate> =
    object : Iterator<java.time.LocalDate> {
        private var current = start

        override fun hasNext(): Boolean =
            current <= endInclusive

        override fun next(): java.time.LocalDate =
            current.also { current = current.plusDays(1) }
    }

val start = java.time.LocalDate.of(2026, 7, 28)
for (date in start..start.plusDays(2)) {
    println(date)
}
```

문법이 자연스럽다고 해서 모든 타입에 연산자를 붙여야 하는 것은 아닙니다. 연산 의미가 도메인에서 예측 가능하고 기존 연산자의 직관을 깨지 않을 때 사용합니다.

## 구조 분해와 `componentN`

```kotlin
class Coordinates(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}

val (x, y) = Coordinates(10, 20)
```

구조 분해는 내부적으로 `component1`, `component2` 등을 호출합니다. 데이터 클래스는 주 생성자 프로퍼티에 대해 이 함수를 자동 생성합니다.

```kotlin
data class FileName(
    val name: String,
    val extension: String,
)

fun splitFileName(fullName: String): FileName {
    val (name, extension) = fullName.split(".", limit = 2)
    return FileName(name, extension)
}

for ((key, value) in mapOf("JetBrains" to "Kotlin")) {
    println("$key -> $value")
}
```

프로퍼티 순서를 바꾸면 구조 분해 의미도 바뀔 수 있으므로, 공개 데이터 클래스에서 순서는 API의 일부처럼 다루는 편이 안전합니다.

## 프로퍼티 위임이 호출하는 함수

```kotlin
class ObservableInt(
    initialValue: Int,
    private val onChange: (String, Int, Int) -> Unit,
) {
    private var value = initialValue

    operator fun getValue(
        owner: Any?,
        property: kotlin.reflect.KProperty<*>,
    ): Int = value

    operator fun setValue(
        owner: Any?,
        property: kotlin.reflect.KProperty<*>,
        newValue: Int,
    ) {
        val oldValue = value
        value = newValue
        onChange(property.name, oldValue, newValue)
    }
}

class Employee(age: Int, salary: Int) {
    private val logger = { name: String, old: Int, new: Int ->
        println("$name: $old -> $new")
    }

    var age: Int by ObservableInt(age, logger)
    var salary: Int by ObservableInt(salary, logger)
}
```

`by` 오른쪽 객체를 위임 객체라고 합니다. 프로퍼티를 읽을 때 `getValue`, 쓸 때 `setValue`가 호출되며, `KProperty`를 통해 프로퍼티 이름 같은 메타데이터도 받을 수 있습니다.

## `lazy`로 초기화를 한 번만

직접 뒷받침 프로퍼티를 쓰면 널 처리와 캐시 로직이 반복됩니다.

```kotlin
data class Email(val address: String)

class User(val name: String) {
    val emails: List<Email> by lazy {
        println("$name 이메일 로드")
        loadEmails(name)
    }
}
```

첫 접근에만 람다가 실행되고 이후 결과가 재사용됩니다. 기본 `lazy`는 동기화를 포함합니다. 단일 스레드만 접근한다는 전제가 명확하고 비용이 중요한 경우에는 별도 스레드 안전 모드를 검토할 수 있지만, 기본값을 바꾸기 전에 객체 접근 방식을 먼저 확인해야 합니다.

## 맵을 프로퍼티 저장소로 사용하기

표준 라이브러리는 맵에도 위임 관례를 제공합니다.

```kotlin
class DynamicPerson {
    private val attributes = mutableMapOf<String, String>()

    val name: String by attributes

    fun setAttribute(name: String, value: String) {
        attributes[name] = value
    }
}

val person = DynamicPerson()
person.setAttribute("name", "Dmitry")
println(person.name)
```

프로퍼티 이름인 `name`이 맵 키로 사용됩니다. 동적 속성을 정적 프로퍼티처럼 노출할 수 있지만, 키가 없을 때의 실패 방식과 타입 변환 정책을 함께 설계해야 합니다.

## 두 종류의 위임을 구분하기

| 문법 | 대상 | 목적 |
|---|---|---|
| `class C : I by delegate` | 인터페이스 구현 | 메서드 전달 코드 제거 |
| `val value by delegate` | 프로퍼티 접근 | 저장·초기화·관찰 로직 재사용 |

이전 글: [04. 고차 함수, 인라인과 제네릭](./04-higher-order-functions-generics.pub.md)

다음 글: [06. DSL, 애노테이션과 리플렉션](./06-dsl-annotations-reflection.pub.md)
