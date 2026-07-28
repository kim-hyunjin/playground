---
title: "[Kotlin in Action 04] 고차 함수, 인라인과 제네릭"
description: "함수 타입, 함수를 반환하는 함수, inline과 non-local return, 제네릭 제약, reified와 변성을 실제 코드로 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - HigherOrderFunctions
  - Inline
  - Generics
summary: "함수를 값으로 추상화하고 제네릭 타입 안전성을 유지하는 법을 inline, reified, in/out 예제로 연결합니다."
---

고차 함수는 동작을 값으로 받아 공통 흐름과 바뀌는 정책을 분리합니다. 제네릭은 그 추상화가 타입 안전성을 잃지 않게 합니다. 두 기능을 함께 이해하면 표준 라이브러리의 `filter`, `map` 같은 API가 어떻게 설계되는지 보입니다.

## 함수 타입 읽기

```kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
val action: () -> Unit = { println(42) }
val nullableResult: (Int) -> Int? = { null }
val nullableFunction: ((Int) -> Int)? = null
```

괄호 위치가 중요합니다. `(Int) -> Int?`는 함수는 존재하지만 결과가 널일 수 있고, `((Int) -> Int)?`는 함수 자체가 널일 수 있습니다.

## 함수를 인자로 받기

```kotlin
fun twoAndThree(operation: (Int, Int) -> Int): Int =
    operation(2, 3)

println(twoAndThree { a, b -> a + b })
println(twoAndThree { a, b -> a * b })
```

함수 타입 값은 일반 함수처럼 호출하거나 `invoke`를 명시할 수 있습니다.

```kotlin
fun String.filterChars(predicate: (Char) -> Boolean): String =
    buildString {
        for (char in this@filterChars) {
            if (predicate(char)) append(char)
        }
    }

println("ab12cd".filterChars(Char::isDigit))
```

## 기본 변환 함수를 받는 API

```kotlin
fun <T> Collection<T>.joinTransformed(
    separator: String = ", ",
    transform: (T) -> String = { it.toString() },
): String {
    val result = StringBuilder()
    for ((index, element) in withIndex()) {
        if (index > 0) result.append(separator)
        result.append(transform(element))
    }
    return result.toString()
}

val words = listOf("Alpha", "Beta")
println(words.joinTransformed())
println(words.joinTransformed(" | ") { it.lowercase() })
```

변환 정책을 함수로 받으면 컬렉션 순회와 구분자 처리 로직을 재사용할 수 있습니다.

## 함수를 반환하기

```kotlin
enum class Delivery { STANDARD, EXPEDITED }
data class Order(val itemCount: Int)

fun shippingCalculator(delivery: Delivery): (Order) -> Double =
    when (delivery) {
        Delivery.STANDARD -> { order -> 6.0 + 2.1 * order.itemCount }
        Delivery.EXPEDITED -> { order -> 1.2 * order.itemCount }
    }

val calculate = shippingCalculator(Delivery.EXPEDITED)
println(calculate(Order(3)))
```

전략마다 클래스를 만들지 않고 람다를 반환해 정책을 표현했습니다. 필터 조건을 조립하는 빌더에도 같은 형태를 쓸 수 있습니다.

```kotlin
data class Contact(
    val firstName: String,
    val lastName: String,
    val phone: String?,
)

fun contactPredicate(
    prefix: String,
    onlyWithPhone: Boolean,
): (Contact) -> Boolean = { contact ->
    val matchesName =
        contact.firstName.startsWith(prefix) ||
        contact.lastName.startsWith(prefix)

    matchesName && (!onlyWithPhone || contact.phone != null)
}
```

## 고차 함수로 중복 제거

```kotlin
enum class OS { WINDOWS, LINUX, MAC, IOS, ANDROID }
data class Visit(val path: String, val duration: Double, val os: OS)

fun List<Visit>.averageDurationFor(
    predicate: (Visit) -> Boolean,
): Double = filter(predicate)
    .map(Visit::duration)
    .average()

val mobileAverage = visits.averageDurationFor {
    it.os == OS.IOS || it.os == OS.ANDROID
}
```

공통 계산 흐름은 함수에 남고 “어떤 방문을 고를지”만 호출부에서 제공합니다.

## `inline`이 없애는 것

포획 변수가 있는 람다는 호출 문맥을 보관할 객체가 필요할 수 있습니다. 람다를 받는 짧은 함수에 `inline`을 붙이면 컴파일러가 함수와 람다 본문을 호출 지점에 펼칠 수 있습니다.

```kotlin
inline fun <T> withLock(
    lock: java.util.concurrent.locks.Lock,
    action: () -> T,
): T {
    lock.lock()
    try {
        return action()
    } finally {
        lock.unlock()
    }
}
```

인라인은 단순 함수 호출을 무조건 빠르게 만드는 장식이 아닙니다. JVM도 일반 호출을 JIT로 최적화하고, 인라인 함수가 크면 호출 지점마다 바이트코드가 늘어납니다. **람다 객체 비용을 줄이거나 인라인 전용 제어 흐름이 필요할 때** 효과가 큽니다.

람다 파라미터를 저장하거나 나중에 호출해야 한다면 펼칠 수 없습니다. 그런 파라미터에는 `noinline`을 사용합니다.

## non-local return

인라인 함수에 전달된 람다의 `return`은 바깥 함수를 끝낼 수 있습니다.

```kotlin
data class Person(val name: String)

fun findAlice(people: List<Person>) {
    people.forEach {
        if (it.name == "Alice") {
            println("Found")
            return
        }
    }
    println("Not found")
}
```

람다만 빠져나오려면 레이블을 사용합니다.

```kotlin
fun skipAlice(people: List<Person>) {
    people.forEach {
        if (it.name == "Alice") return@forEach
        println(it.name)
    }
}
```

무명 함수의 `return`은 그 무명 함수만 반환합니다.

```kotlin
people.forEach(fun(person) {
    if (person.name == "Alice") return
    println(person.name)
})
```

## 타입 파라미터와 상한

```kotlin
fun <T : Number> half(value: T): Double =
    value.toDouble() / 2.0

fun <T : Comparable<T>> max(first: T, second: T): T =
    if (first > second) first else second
```

여러 제약은 `where`로 표현합니다.

```kotlin
fun <T> ensurePeriod(sequence: T)
    where T : CharSequence, T : Appendable {
    if (!sequence.endsWith('.')) {
        sequence.append('.')
    }
}
```

제네릭 타입 파라미터 `T`는 기본적으로 널 가능 타입도 받을 수 있습니다. 널을 금지하려면 `<T : Any>`로 상한을 둡니다.

## 타입 소거와 `reified`

JVM에서는 `List<String>`과 `List<Int>`의 타입 인자 정보가 런타임에 지워집니다.

```kotlin
fun isList(value: Any): Boolean =
    value is List<*>
```

`value is List<String>`처럼 원소 타입까지 검사할 수는 없습니다. 하지만 인라인 함수의 타입 파라미터를 `reified`로 표시하면 호출 지점의 구체 타입을 사용할 수 있습니다.

```kotlin
inline fun <reified T> isA(value: Any): Boolean =
    value is T

println(isA<String>("Kotlin"))

val mixed = listOf("one", 2, "three")
val strings = mixed.filterIsInstance<String>()
```

실체화 타입 파라미터는 인라인 함수에서만 쓸 수 있고, 자바 호출부에서는 같은 방식으로 사용할 수 없다는 경계가 있습니다.

## 공변성 `out`: 생산자

`Cat`이 `Animal`의 하위 타입이어도 `Box<Cat>`과 `Box<Animal>`의 관계는 별도로 선언해야 합니다.

```kotlin
open class Animal
class Cat : Animal()

interface Producer<out T> {
    fun produce(): T
}
```

`out T`는 `T`를 주로 반환하는 생산자이며, `Producer<Cat>`을 `Producer<Animal>`이 필요한 곳에 전달할 수 있다는 뜻입니다. 공변 타입 파라미터를 공개 API의 입력 위치에 사용할 수는 없습니다.

읽기 전용 `List<T>`도 `T`에 공변적이므로 `List<String>`을 `List<Any>`로 읽을 수 있습니다.

## 반공변성 `in`: 소비자

```kotlin
interface Consumer<in T> {
    fun consume(value: T)
}
```

`in T`는 값을 받는 소비자입니다. `Consumer<Animal>`은 고양이를 포함한 모든 동물을 받을 수 있으므로 `Consumer<Cat>`이 필요한 곳에도 사용할 수 있습니다.

함수 타입 `(P) -> R`은 파라미터 `P`에 반공변적이고 반환 `R`에 공변적입니다.

## 사용 지점 변성과 스타 프로젝션

선언 자체를 바꾸지 않고 특정 파라미터에서만 역할을 제한할 수 있습니다.

```kotlin
fun <T> copyData(
    source: MutableList<out T>,
    destination: MutableList<in T>,
) {
    for (item in source) {
        destination.add(item)
    }
}
```

`MutableList<*>`는 원소 타입을 모르는 리스트입니다. 안전하게 `Any?`로 읽을 수 있지만, 구체 타입을 모르므로 임의의 값을 넣을 수 없습니다.

## 기억할 문장

- 함수 타입은 바뀌는 동작을 값으로 분리합니다.
- `inline`은 특히 람다를 받는 짧은 함수에서 의미가 있습니다.
- `reified`는 타입 소거를 없애는 것이 아니라 호출 지점의 구체 타입을 코드에 심습니다.
- `out`은 생산, `in`은 소비입니다.
- `*`는 “아무 타입이나 넣어도 된다”가 아니라 “원소 타입을 모른다”는 뜻입니다.

이전 글: [03. 클래스, 위임과 객체](./03-classes-delegation-objects.pub.md)

다음 글: [05. 연산자, 구조 분해와 프로퍼티 위임](./05-conventions-and-property-delegation.pub.md)
