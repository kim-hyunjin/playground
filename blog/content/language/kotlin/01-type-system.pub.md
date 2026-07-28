---
title: "[Kotlin in Action 01] 널 안전성, 컬렉션과 타입"
description: "널 가능 타입, 안전 호출, 엘비스 연산자, 플랫폼 타입, 읽기 전용 컬렉션과 JVM 타입 표현을 실제 코드로 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - NullSafety
  - TypeSystem
  - Collections
summary: "코틀린이 null과 JVM 타입을 컴파일 시점에 다루는 방식과 안전한 컬렉션 경계를 예제로 익힙니다."
---

코틀린 타입 시스템의 핵심은 런타임에 발생하던 실패를 가능한 한 컴파일 시점으로 옮기는 것입니다. 이 글에서는 `type_system` 실습의 코드를 한 흐름으로 엮어 널 가능성, JVM 원시 타입, 컬렉션과 배열을 살펴봅니다.

## `String`과 `String?`은 다른 타입이다

```kotlin
fun length(text: String): Int = text.length

fun safeLength(text: String?): Int? = text?.length
```

`String`에는 `null`을 전달할 수 없습니다. `String?`에는 전달할 수 있지만, 값을 사용하려면 컴파일러가 널 처리 여부를 확인합니다. 널 가능 타입은 별도 래퍼 객체가 아니라 컴파일 시점의 제약이므로 이 검사 자체가 런타임 래퍼 비용을 만들지는 않습니다.

## 안전 호출과 엘비스 연산자

```kotlin
data class Address(
    val street: String,
    val city: String,
    val country: String,
)

data class Company(val name: String, val address: Address?)
data class Person(val name: String, val company: Company?)

fun Person.countryName(): String =
    company?.address?.country ?: "Unknown"
```

`?.`는 왼쪽 값이 널이 아닐 때만 다음 접근을 수행합니다. 연쇄 중 하나라도 널이면 전체 결과가 널이 되고, `?:`가 기본값을 제공합니다.

엘비스 연산자의 오른쪽에는 값뿐 아니라 `return`이나 예외도 둘 수 있습니다.

```kotlin
fun shippingLabel(person: Person): String {
    val address = person.company?.address
        ?: throw IllegalArgumentException("No address")

    return "${address.street}, ${address.city}, ${address.country}"
}
```

이후 코드에서 `address`는 널이 아닌 `Address`입니다. 실패 경로를 입구에서 끝냈기 때문입니다.

## `let`, `as?`, `!!`의 역할

널 가능 값을 널이 아닌 인자에 넘길 때 안전 호출과 `let`을 조합할 수 있습니다.

```kotlin
fun sendEmailTo(email: String) {
    println("send to $email")
}

val email: String? = "dev@example.com"
email?.let { sendEmailTo(it) }
```

안전한 캐스트 `as?`는 캐스트 실패를 예외가 아니라 널로 바꿉니다.

```kotlin
class Name(
    private val first: String,
    private val last: String,
) {
    override fun equals(other: Any?): Boolean {
        val name = other as? Name ?: return false
        return first == name.first && last == name.last
    }

    override fun hashCode(): Int = first.hashCode() * 37 + last.hashCode()
}
```

`!!`는 “널이 아님을 개발자가 보장한다”는 단언입니다. 틀리면 즉시 NPE가 발생하므로 외부 입력이나 긴 호출 연쇄에 쓰기보다, 타입으로 보장할 수 없지만 불변식이 명확한 좁은 지점에만 제한하는 편이 낫습니다.

## 널 가능 타입의 확장 함수

확장 함수의 수신 타입 자체를 널 가능하게 만들 수 있습니다.

```kotlin
fun String?.isMissing(): Boolean =
    this == null || isBlank()

fun verifyInput(input: String?) {
    if (input.isMissing()) {
        println("필수 값을 입력하세요.")
    }
}
```

이 함수 안에서 `this`는 널일 수 있습니다. 여러 호출부에서 똑같은 널 검사를 반복할 때 유용하지만, 모든 확장을 습관적으로 널 가능 타입에 정의하면 잘못된 상태를 숨길 수 있습니다.

## `lateinit`은 초기화를 늦출 뿐이다

DI나 테스트 프레임워크처럼 객체 생성 뒤 값을 주입하는 환경에서는 `lateinit`을 사용할 수 있습니다.

```kotlin
class Service {
    fun action() = "done"
}

class ServiceTest {
    private lateinit var service: Service

    fun setUp() {
        service = Service()
    }

    fun testAction() {
        check(service.action() == "done")
    }
}
```

`lateinit` 프로퍼티는 `var`여야 하고 널이 아닌 타입에 사용합니다. 초기화 전에 읽으면 `UninitializedPropertyAccessException`이 발생하므로, 널 안전성을 없애는 도구가 아니라 프레임워크 생명주기와 타입을 연결하는 도구로 봐야 합니다.

## 플랫폼 타입: 자바 경계의 책임

자바 선언에 널 가능성 애노테이션이 없으면 코틀린은 그 값을 플랫폼 타입으로 취급합니다. 개발자는 이를 `String`으로도 `String?`으로도 받을 수 있지만, 컴파일러가 안전을 보장할 정보가 없습니다.

```kotlin
// Java API가 null 가능성을 명시하지 않았다고 가정
val value: String? = legacyApi.lookup()
val normalized = value?.trim().orEmpty()
```

외부 자바 API의 계약이 불분명하다면 경계에서 널 가능 타입으로 받고 검증한 뒤, 내부에는 널이 아닌 타입만 전달하는 방식이 안전합니다.

## 원시 타입, 박싱과 숫자 변환

코틀린 소스에서는 원시 타입과 래퍼 타입을 구분하지 않지만 JVM 표현은 문맥에 따라 달라집니다.

```kotlin
val number: Int = 1        // 보통 JVM int
val boxed: Int? = 1       // null을 담아야 하므로 java.lang.Integer
val numbers: List<Int> = listOf(1, 2, 3) // 제네릭 인자는 박싱
```

숫자 타입 사이에는 암시적 변환이 없습니다.

```kotlin
val intValue = 1
val longValue: Long = intValue.toLong()

fun acceptLong(value: Long) = value
acceptLong(42L)
```

명시적 변환은 범위가 다른 숫자 사이에서 의도치 않은 손실을 숨기지 않게 합니다.

## `Any`, `Unit`, `Nothing`

```kotlin
interface Processor<T> {
    fun process(): T
}

class LoggingProcessor : Processor<Unit> {
    override fun process() {
        println("processed")
    }
}

fun fail(message: String): Nothing =
    throw IllegalStateException(message)
```

- `Any`는 널이 아닌 모든 코틀린 타입의 최상위 타입입니다. 널까지 포함하려면 `Any?`입니다.
- `Unit`은 의미 있는 반환값이 없는 함수의 반환 타입이지만, `void`와 달리 타입 인자로도 쓸 수 있습니다.
- `Nothing`은 함수가 정상적으로 돌아오지 않음을 나타냅니다.

`Nothing` 덕분에 다음 식에서 `address`의 타입은 `Address`로 정리됩니다.

```kotlin
val address: Address = person.company?.address ?: fail("No address")
```

## 컬렉션 원소의 널 가능성

컬렉션 자체와 원소의 널 가능성은 별개입니다.

```kotlin
fun parseLines(lines: Sequence<String>): List<Int?> =
    lines.map { it.toIntOrNull() }.toList()

fun summarize(numbers: List<Int?>) {
    val valid: List<Int> = numbers.filterNotNull()

    println("합계: ${valid.sum()}")
    println("잘못된 값: ${numbers.size - valid.size}")
}
```

`List<Int?>`는 리스트는 널이 아니지만 원소가 널일 수 있습니다. `List<Int>?`는 리스트 자체가 널일 수 있지만, 존재한다면 원소는 널이 아닙니다.

## 읽기 전용과 변경 가능 컬렉션

코틀린은 읽는 인터페이스와 변경하는 인터페이스를 분리합니다.

```kotlin
fun <T> copyElements(
    source: Collection<T>,
    target: MutableCollection<T>,
) {
    for (item in source) {
        target.add(item)
    }
}

val source: Collection<Int> = arrayListOf(3, 5, 7)
val target: MutableCollection<Int> = arrayListOf(1)
copyElements(source, target)
```

함수 시그니처만 보고도 `source`는 읽기만 하고 `target`은 변경한다는 사실을 알 수 있습니다. 하지만 읽기 전용 인터페이스가 객체 불변성이나 스레드 안전성을 보장하는 것은 아닙니다. 같은 객체를 가리키는 다른 변경 가능 참조가 있을 수 있고, 자바 코드가 내용을 바꿀 수도 있습니다.

## 배열과 JVM 경계

```kotlin
val letters = Array(26) { index -> ('a' + index).toString() }
val zeros = IntArray(5)
val squares = IntArray(5) { index -> (index + 1) * (index + 1) }

val strings = listOf("a", "b", "c")
println("%s/%s/%s".format(*strings.toTypedArray()))
```

`Array<Int>`는 JVM의 `Integer[]`, `IntArray`는 `int[]`에 대응합니다. 배열을 `vararg`에 넘길 때는 스프레드 연산자 `*`로 원소를 펼칩니다.

## 판단 기준

| 상황 | 선택 |
|---|---|
| 값이 없어도 정상 | `T?`와 명시적 처리 |
| 값이 반드시 필요 | 생성자나 경계 검증 후 `T` |
| 타입 변환 실패가 정상 분기 | `as?` |
| 프레임워크가 나중에 주입 | 좁은 범위의 `lateinit` |
| 읽기만 하는 인자 | `Collection<T>` |
| 원소를 추가·삭제하는 인자 | `MutableCollection<T>` |

이전 글: [00. 코틀린 핵심 문법과 함수](./kotlin-in-action-summary.pub.md)

다음 글: [02. 람다, 컬렉션과 시퀀스](./02-lambdas-collections-sequences.pub.md)
