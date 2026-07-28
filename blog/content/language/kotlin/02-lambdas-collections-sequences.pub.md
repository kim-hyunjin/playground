---
title: "[Kotlin in Action 02] 람다, 컬렉션과 시퀀스"
description: "람다 문법, 변수 포획, 멤버 참조, 컬렉션 연산, 시퀀스의 지연 계산과 수신 객체 지정 람다를 예제로 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - Lambda
  - Collections
  - Sequence
summary: "반복문을 람다와 컬렉션 연산으로 바꾸고, 시퀀스가 언제 중간 컬렉션을 줄이는지 실행 순서까지 확인합니다."
---

람다는 코드 조각을 값처럼 전달하게 해 줍니다. 중요한 것은 문법을 줄이는 데서 끝나지 않고, 반복과 조건을 표준 컬렉션 연산으로 표현해 **무엇을 하는 코드인지** 드러내는 것입니다.

## 반복문에서 람다로

가장 나이가 많은 사람을 직접 찾으면 상태 변수가 필요합니다.

```kotlin
data class Person(val name: String, val age: Int)

fun oldest(people: List<Person>): Person? {
    var result: Person? = null
    for (person in people) {
        if (result == null || person.age > result.age) {
            result = person
        }
    }
    return result
}
```

표준 함수에 비교 기준을 넘기면 의도가 바로 보입니다.

```kotlin
val people = listOf(
    Person("Alice", 29),
    Person("Bob", 31),
)

println(people.maxByOrNull { it.age })
```

람다는 `{ 파라미터 -> 본문 }` 형태입니다. 함수의 마지막 인자라면 괄호 밖으로 뺄 수 있고, 인자가 하나이며 타입 추론이 가능하면 기본 이름 `it`을 쓸 수 있습니다. 중첩 람다에서는 `it`이 어느 값을 뜻하는지 흐려지므로 이름을 붙이는 편이 낫습니다.

## 함수와 프로퍼티를 직접 참조하기

람다가 멤버 하나를 호출하는 역할만 한다면 `::` 멤버 참조로 바꿀 수 있습니다.

```kotlin
val getAge = Person::age
println(people.maxByOrNull(getAge))

fun salute() = println("Salute!")
run(::salute)

val createPerson = ::Person
val alice = createPerson("Alice", 29)
```

- `Person::age`: 수신 객체를 나중에 받는 참조
- `alice::age`: `alice`가 이미 묶인 바운드 참조
- `::Person`: 생성자 참조
- `::salute`: 최상위 함수 참조

## 람다는 바깥 변수를 포획한다

```kotlin
fun printProblemCounts(responses: Collection<String>) {
    var clientErrors = 0
    var serverErrors = 0

    responses.forEach { response ->
        when {
            response.startsWith("4") -> clientErrors++
            response.startsWith("5") -> serverErrors++
        }
    }

    println("$clientErrors client errors, $serverErrors server errors")
}
```

람다가 사용하는 바깥 변수를 **포획한 변수**라고 합니다. 변경 가능한 변수를 포획한 람다는 그 상태를 유지할 래퍼 객체가 필요할 수 있습니다. 특히 오래 저장되거나 비동기로 실행되는 콜백은 호출 시점의 상태를 포획한다는 점을 고려해야 합니다.

## `filter`와 `map`

```kotlin
val adults = people
    .filter { it.age >= 30 }
    .map(Person::name)

println(adults)
```

- `filter`: 조건이 참인 원소만 남깁니다.
- `map`: 각 원소를 다른 값으로 변환합니다.

비싼 계산을 람다 안에서 반복하지 않도록 주의합니다.

```kotlin
// 최댓값을 원소마다 다시 계산하지 않는다.
val maxAge = people.maxOfOrNull(Person::age)
val oldestPeople = people.filter { it.age == maxAge }
```

맵은 키와 값에 맞는 연산을 따로 제공합니다.

```kotlin
val numbers = mapOf(0 to "zero", 1 to "one")
val upper = numbers.mapValues { (_, value) -> value.uppercase() }
```

## 조건 검사와 그룹화

```kotlin
val canJoin = { person: Person -> person.age <= 27 }

people.all(canJoin)
people.any(canJoin)
people.count(canJoin)
people.find(canJoin)
```

`filter(predicate).size`는 중간 리스트를 만들지만 `count(predicate)`는 바로 개수만 셉니다.

```kotlin
val byAge: Map<Int, List<Person>> = people.groupBy(Person::age)
```

여러 컬렉션을 펼치면서 변환할 때는 `flatMap`을 씁니다.

```kotlin
data class Book(val title: String, val authors: List<String>)

val books = listOf(
    Book("Mort", listOf("Terry Pratchett")),
    Book("Good Omens", listOf("Terry Pratchett", "Neil Gaiman")),
)

val authors = books
    .flatMap(Book::authors)
    .toSet()
```

## 즉시 계산과 시퀀스의 지연 계산

리스트에 `map`과 `filter`를 연쇄하면 각 단계가 새 컬렉션을 만듭니다. 데이터가 크고 연산 단계가 많다면 시퀀스로 중간 컬렉션을 줄일 수 있습니다.

```kotlin
val result = people
    .asSequence()
    .filter { it.name.length < 4 }
    .map(Person::name)
    .toList()
```

`asSequence()` 뒤의 `filter`, `map`은 중간 연산입니다. `toList`, `sum`, `find` 같은 최종 연산을 만나기 전까지 실행되지 않습니다.

```kotlin
val sequence = listOf(1, 2, 3, 4)
    .asSequence()
    .map {
        print("map($it) ")
        it * it
    }
    .filter {
        print("filter($it) ")
        it % 2 == 0
    }

// 아직 아무 출력도 없다.
println(sequence.toList())
```

시퀀스는 원소별로 전체 연산을 통과시킵니다. 그래서 답을 찾으면 뒤의 원소를 건너뛸 수 있습니다.

```kotlin
val first = generateSequence(0) { it + 1 }
    .map { it * it }
    .first { it > 100 }
```

시퀀스가 항상 더 빠른 것은 아닙니다. 작은 컬렉션에서는 인라인되는 일반 컬렉션 연산이 더 단순할 수 있습니다. **큰 입력, 여러 중간 단계, 조기 종료 가능성**이 있을 때 시퀀스를 우선 검토합니다.

## 자바 SAM 인터페이스와 람다

자바의 `Runnable`, `Callable`처럼 추상 메서드가 하나인 인터페이스는 람다로 만들 수 있습니다.

```kotlin
fun allDone(): Runnable =
    Runnable { println("All done!") }

allDone().run()
```

주변 변수를 포획하지 않는 람다는 인스턴스를 재사용할 여지가 있지만, 값을 포획하면 호출 문맥을 보관할 객체가 필요합니다.

## `with`, `apply`, `buildString`

수신 객체 지정 람다에서는 대상 객체의 멤버를 수신 객체 이름 없이 호출할 수 있습니다.

```kotlin
fun alphabetWith(): String = with(StringBuilder()) {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
    toString() // with는 람다의 마지막 값을 반환
}

fun alphabetApply(): String = StringBuilder().apply {
    for (letter in 'A'..'Z') {
        append(letter)
    }
    append("\nNow I know the alphabet!")
}.toString() // apply는 수신 객체를 반환

fun alphabetBuildString(): String = buildString {
    for (letter in 'A'..'Z') append(letter)
}
```

`with`는 일반 함수이고 결과 계산에 적합합니다. `apply`는 수신 객체를 돌려주므로 생성 직후 설정할 때 적합합니다. `buildString`은 `StringBuilder`를 직접 만들고 변환하는 준비 코드를 감춥니다.

## 실전 선택표

| 원하는 작업 | 함수 |
|---|---|
| 조건에 맞는 원소만 남기기 | `filter` |
| 원소를 다른 타입으로 바꾸기 | `map` |
| 중첩 컬렉션을 변환하며 펼치기 | `flatMap` |
| 기준별로 묶기 | `groupBy` |
| 존재·전체 조건 검사 | `any`, `all` |
| 첫 일치 원소 찾기 | `find`, `firstOrNull` |
| 큰 연산 체인을 지연 실행 | `asSequence` |
| 객체를 설정하고 그대로 반환 | `apply` |

이전 글: [01. 널 안전성, 컬렉션과 타입](./01-type-system.pub.md)

다음 글: [03. 클래스, 위임과 객체](./03-classes-delegation-objects.pub.md)
