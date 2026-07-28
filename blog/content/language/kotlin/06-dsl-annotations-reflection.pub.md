---
title: "[Kotlin in Action 06] DSL, 애노테이션과 리플렉션"
description: "수신 객체 지정 람다와 중위 호출로 내부 DSL을 만들고, 애노테이션과 Kotlin 리플렉션으로 런타임 메타데이터를 처리하는 법을 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - DSL
  - Annotation
  - Reflection
summary: "읽기 좋은 내부 DSL을 만드는 언어 기능과 애노테이션·리플렉션 기반 메타프로그래밍의 경계를 예제로 익힙니다."
---

이 시리즈의 마지막 글은 앞에서 배운 확장 함수, 람다, 연산자 관례, 제네릭을 API 설계에 조합합니다. 내부 DSL은 호출 구조를 읽기 좋게 만들고, 애노테이션과 리플렉션은 컴파일 시점에 알 수 없던 메타데이터를 런타임에 처리합니다.

## 내부 DSL은 새 언어가 아니다

외부 DSL인 SQL이나 정규식은 자체 문법과 실행 엔진을 가집니다. 코틀린 내부 DSL은 코틀린 문법 안에서 함수 호출을 특정 구조로 조합한 API입니다. 따라서 IDE 지원과 타입 검사를 그대로 받습니다.

좋은 DSL의 목표는 기호를 많이 쓰는 것이 아니라 다음 두 가지입니다.

- 읽는 사람이 어떤 결과가 생길지 예측할 수 있다.
- 반복되는 준비 코드가 감춰지고 핵심 구조가 드러난다.

## 수신 객체가 있는 함수 타입

```kotlin
fun buildText(
    action: StringBuilder.() -> Unit,
): String =
    StringBuilder()
        .apply(action)
        .toString()

val text = buildText {
    append("Hello, ")
    append("World!")
}
```

`StringBuilder.() -> Unit`은 수신 객체가 `StringBuilder`인 함수 타입입니다. 호출자는 람다 안에서 `append`를 직접 부르고, `buildText`는 실제 수신 객체를 제공합니다.

이 구조가 중첩되면 HTML 빌더처럼 트리 구조를 코드로 표현할 수 있습니다.

```kotlin
createHTML().table {
    val numbers = mapOf(1 to "one", 2 to "two")
    for ((number, word) in numbers) {
        tr {
            td { +"$number" }
            td { +word }
        }
    }
}
```

각 람다의 수신 타입이 사용할 수 있는 태그를 제한하므로 단순 문자열 연결보다 구조가 분명합니다.

## 중위 호출로 문장 형태 만들기

인자가 하나인 멤버 함수나 확장 함수에 `infix`를 붙이면 점과 괄호를 생략할 수 있습니다.

```kotlin
interface Matcher<T> {
    fun test(value: T)
}

class StartsWith(
    private val prefix: String,
) : Matcher<String> {
    override fun test(value: String) {
        require(value.startsWith(prefix)) {
            "$value does not start with $prefix"
        }
    }
}

infix fun <T> T.should(matcher: Matcher<T>) {
    matcher.test(this)
}

"kotlin" should StartsWith("kot")
```

여러 중위 호출을 이어 문장처럼 만들 수도 있지만 우선순위와 타입 흐름이 불명확해지기 쉽습니다. 테스트나 제한된 도메인처럼 독자가 어휘를 공유하는 곳에서 특히 효과적입니다.

## 확장 프로퍼티로 단위 표현하기

```kotlin
val Int.days: java.time.Period
    get() = java.time.Period.ofDays(this)

val java.time.Period.fromNow: java.time.LocalDate
    get() = java.time.LocalDate.now() + this

println(3.days.fromNow)
```

원시 값에 단위를 붙이면 호출부의 의미가 또렷해집니다. 다만 `Int` 자체에 상태를 추가한 것은 아니며, 매 접근마다 값을 계산하는 확장 프로퍼티입니다.

## `invoke`로 객체를 함수처럼

```kotlin
class Greeter(private val greeting: String) {
    operator fun invoke(name: String): String =
        "$greeting, $name!"
}

val greet = Greeter("Hello")
println(greet("Kotlin"))
```

함수 타입을 구현하는 클래스도 `invoke`를 재정의합니다.

```kotlin
data class Issue(
    val project: String,
    val type: String,
    val priority: String,
)

class ImportantIssue(
    private val project: String,
) : (Issue) -> Boolean {
    override fun invoke(issue: Issue): Boolean =
        issue.project == project &&
            issue.type == "Bug" &&
            issue.priority in setOf("Major", "Critical")
}

val important = issues.filter(ImportantIssue("IDEA"))
```

복잡한 조건이 상태와 보조 함수를 가져야 한다면 이름 없는 람다보다 함수 객체가 읽기 좋을 수 있습니다.

## 애노테이션 선언과 적용 대상

```kotlin
@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class JsonExclude

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class JsonName(val name: String)

data class Person(
    @JsonName("alias")
    val firstName: String,

    @JsonExclude
    val temporaryValue: String,
)
```

애노테이션 클래스는 본문 없이 생성자 파라미터를 `val`로 선언합니다. 메타 애노테이션으로 적용 대상과 유지 시점을 정합니다. 리플렉션으로 읽으려면 런타임까지 애노테이션이 유지되어야 합니다.

코틀린 프로퍼티 하나는 JVM 필드, 게터, 생성자 파라미터 등 여러 요소로 컴파일될 수 있습니다. 특정 요소에 적용해야 한다면 사용 지점 대상을 명시합니다.

```kotlin
class RuleHolder(
    @get:Deprecated("새 규칙을 사용하세요.")
    val oldRule: String,
)
```

## 애노테이션 인자로 클래스 받기

```kotlin
interface Company
class CompanyImpl : Company

@Target(AnnotationTarget.PROPERTY)
annotation class DeserializeInterface(
    val targetClass: kotlin.reflect.KClass<out Any>,
)

data class Employee(
    val name: String,
    @DeserializeInterface(CompanyImpl::class)
    val company: Company,
)
```

클래스 참조는 `MyClass::class`로 전달하고 `KClass`로 받습니다. 제네릭 구현 클래스를 제한하려면 스타 프로젝션과 상한을 조합할 수 있습니다.

```kotlin
interface ValueSerializer<T>

annotation class CustomSerializer(
    val serializerClass:
        kotlin.reflect.KClass<out ValueSerializer<*>>,
)
```

애노테이션 인자는 컴파일 시점 상수여야 합니다. 원시 타입, 문자열, enum, 클래스 참조, 다른 애노테이션과 그 배열 등을 사용할 수 있습니다.

## `KClass`, `KCallable`, `KFunction`, `KProperty`

```kotlin
data class Profile(val name: String, val age: Int)

fun sum(x: Int, y: Int) = x + y

val profile = Profile("Alice", 29)
val kClass = profile.javaClass.kotlin

println(kClass.simpleName)
kClass.members.forEach { println(it.name) }

val function: kotlin.reflect.KFunction2<Int, Int, Int> = ::sum
println(function(1, 2))

val ageProperty:
    kotlin.reflect.KProperty1<Profile, Int> = Profile::age
println(ageProperty.get(profile))
```

- `KClass`: 클래스
- `KCallable`: 호출할 수 있는 선언의 공통 기반
- `KFunctionN`: 파라미터 수가 N인 함수
- `KProperty0`: 수신 객체가 없는 최상위 프로퍼티
- `KProperty1`: 수신 객체 하나가 필요한 멤버 프로퍼티

코틀린 리플렉션은 별도 `kotlin-reflect` 의존성이 필요합니다. 이 실습 저장소도 `implementation(kotlin("reflect"))`를 포함합니다.

## 애노테이션을 읽어 직렬화 정책 적용하기

```kotlin
inline fun <reified T> kotlin.reflect.KAnnotatedElement
    .findAnnotation(): T? =
    annotations
        .filterIsInstance<T>()
        .firstOrNull()

fun visibleProperties(value: Any) =
    value.javaClass.kotlin.memberProperties
        .filter { property ->
            property.findAnnotation<JsonExclude>() == null
        }
```

이제 이름 변경도 적용할 수 있습니다.

```kotlin
fun propertyName(
    property: kotlin.reflect.KProperty1<out Any, *>,
): String =
    property.findAnnotation<JsonName>()?.name
        ?: property.name
```

실제 직렬화기는 문자열 escaping, 널, 숫자, 중첩 객체, 컬렉션, 순환 참조까지 처리해야 합니다. 예제의 목적은 완성된 JSON 라이브러리를 만드는 것이 아니라 **애노테이션이 정책을 선언하고 리플렉션이 그 정책을 실행하는 흐름**을 확인하는 데 있습니다.

## 언제 리플렉션을 써야 할까

| 상황 | 우선 선택 |
|---|---|
| 타입을 컴파일 시점에 안다 | 일반 함수와 정적 타입 |
| 타입별 동작을 열어 두고 싶다 | 인터페이스, 제네릭 |
| 선언에 메타데이터를 붙인다 | 애노테이션 |
| 런타임에 임의 타입의 멤버를 탐색한다 | 리플렉션 |
| 반복 코드를 생성할 수 있다 | 코드 생성도 함께 검토 |

리플렉션은 강력하지만 이름 변경과 타입 오류를 런타임으로 미룰 수 있습니다. 라이브러리 경계에서 제한적으로 사용하고, 애플리케이션 내부에는 타입이 분명한 모델을 넘기는 방식이 유지보수하기 좋습니다.

## 시리즈 마무리

시리즈는 기본 문법에서 시작해 타입 시스템, 람다, 객체 모델, 고차 함수와 제네릭, 관례를 거쳐 DSL과 리플렉션까지 왔습니다. 각 기능은 독립적인 장식이 아니라 다음처럼 이어집니다.

1. 확장 함수와 관례가 기존 타입에 읽기 좋은 API를 더합니다.
2. 수신 객체 지정 람다가 중첩된 호출 구조를 만듭니다.
3. 제네릭이 DSL의 타입 안전성을 지킵니다.
4. 애노테이션은 선언에 정책을 붙이고 리플렉션은 런타임에 이를 해석합니다.

이전 글: [05. 연산자, 구조 분해와 프로퍼티 위임](./05-conventions-and-property-delegation.pub.md)

처음부터 보기: [00. 코틀린 핵심 문법과 함수](./kotlin-in-action-summary.pub.md)
