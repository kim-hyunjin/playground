---
title: "[Kotlin in Action 03] 클래스, 위임과 객체"
description: "코틀린 클래스의 final 기본값, 인터페이스, 생성자, 데이터 클래스, 클래스 위임, object와 동반 객체를 예제로 설명합니다."
date: 2026-04-22
updated: 2026-07-28
category: "Language"
categories:
  - Language
  - Kotlin
tags:
  - Kotlin
  - OOP
  - Delegation
  - DataClass
summary: "상속을 명시적으로 여는 코틀린 객체 모델과 데이터 클래스, 클래스 위임, object 표현을 실제 코드로 익힙니다."
---

코틀린의 객체 모델은 상속을 기본값으로 두지 않습니다. 클래스와 메서드는 기본적으로 `final`이고, 상속을 의도한 지점만 `open`으로 엽니다. 이 원칙부터 프로퍼티, 데이터 클래스, 위임과 객체 선언까지 연결해 봅니다.

## 인터페이스와 충돌하는 기본 구현

인터페이스는 추상 메서드뿐 아니라 구현이 있는 메서드와 프로퍼티를 포함할 수 있습니다.

```kotlin
interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable!")
}

interface Focusable {
    fun setFocus(focused: Boolean) =
        println(if (focused) "focused" else "unfocused")

    fun showOff() = println("I'm focusable!")
}

class Button : Clickable, Focusable {
    override fun click() = println("clicked")

    override fun showOff() {
        super<Clickable>.showOff()
        super<Focusable>.showOff()
    }
}
```

두 상위 타입이 같은 기본 메서드를 제공하면 구현 클래스가 어느 쪽을 사용할지 명시해야 합니다. 코틀린에서는 오버라이드할 때 `override` 키워드도 반드시 붙입니다.

## 기본은 `final`, 상속은 `open`

```kotlin
open class RichButton : Clickable {
    fun disable() {}       // final
    open fun animate() {}  // override 가능
    override fun click() {}
}

abstract class Animated {
    abstract fun animate()
    open fun stopAnimating() {}
    fun animateTwice() {}
}
```

상속용으로 설계되지 않은 구현이 우연히 재정의되는 일을 막는 기본값입니다. 추상 클래스와 추상 메서드는 정의상 열려 있지만, 일반 메서드는 여전히 `final`입니다.

## 가시성은 패키지보다 모듈 중심

| 변경자 | 클래스 멤버 | 최상위 선언 |
|---|---|---|
| `public` | 모든 곳 | 모든 곳 |
| `internal` | 같은 모듈 | 같은 모듈 |
| `protected` | 클래스와 하위 클래스 | 사용 불가 |
| `private` | 같은 클래스 | 같은 파일 |

자바의 패키지 전용 가시성 대신 `internal`이 있습니다. 모듈은 함께 컴파일되는 파일 묶음입니다. 접근자의 가시성만 좁힐 수도 있습니다.

```kotlin
class LengthCounter {
    var counter: Int = 0
        private set

    fun addWord(word: String) {
        counter += word.length
    }
}
```

외부에서는 값을 읽을 수 있지만 변경은 `addWord`를 거쳐야 하므로 불변식을 한곳에서 관리할 수 있습니다.

## 중첩 클래스와 내부 클래스

```kotlin
class Outer {
    class Nested

    inner class Inner {
        fun outer(): Outer = this@Outer
    }
}
```

코틀린의 중첩 클래스는 기본적으로 바깥 인스턴스를 참조하지 않습니다. 바깥 객체가 필요할 때만 `inner`를 붙입니다. 불필요한 참조가 객체 생명주기를 붙잡는 일을 피할 수 있습니다.

## 주 생성자와 초기화

```kotlin
open class User(
    val nickname: String,
    val subscribed: Boolean = true,
) {
    init {
        require(nickname.isNotBlank())
    }
}

class SocialUser(nickname: String) : User(nickname)
```

주 생성자는 클래스 이름 뒤에 오고, `val`이나 `var`가 붙은 파라미터는 곧 프로퍼티가 됩니다. `init` 블록은 생성자 파라미터를 검사하거나 추가 초기화할 때 사용합니다.

프레임워크 요구 때문에 생성 경로가 여러 개라면 부 생성자를 둘 수 있습니다.

```kotlin
open class View {
    constructor(context: String)
    constructor(context: String, attributes: Map<String, String>)
}

class MyButton : View {
    constructor(context: String) : super(context)

    constructor(
        context: String,
        attributes: Map<String, String>,
    ) : super(context, attributes)
}
```

일반 애플리케이션 코드에서는 기본 인자나 팩토리 함수가 여러 부 생성자보다 의도를 드러내기 쉬운 경우가 많습니다.

## 프로퍼티를 구현하는 세 가지 방식

```kotlin
interface UserProfile {
    val nickname: String
}

class PrivateUser(
    override val nickname: String,
) : UserProfile

class SubscribingUser(
    private val email: String,
) : UserProfile {
    override val nickname: String
        get() = email.substringBefore('@')
}

class ExternalUser(
    accountId: Int,
) : UserProfile {
    override val nickname = "user-$accountId"
}
```

인터페이스의 프로퍼티 계약은 저장 방식까지 정하지 않습니다. 생성자 프로퍼티, 계산 프로퍼티, 초기화 식 가운데 구현에 맞는 방식을 선택합니다.

커스텀 세터에서는 `field`로 뒷받침 필드에 접근합니다.

```kotlin
class Customer(val name: String) {
    var address: String = "unspecified"
        set(value) {
            println("$field -> $value")
            field = value
        }
}
```

## 데이터 클래스가 생성하는 것

일반 값 객체는 `toString`, `equals`, `hashCode`를 함께 구현해야 컬렉션에서도 값 기준으로 올바르게 동작합니다.

```kotlin
data class Client(
    val name: String,
    val postalCode: Int,
)

val client = Client("Kim", 1234)
val moved = client.copy(postalCode = 9999)

println(client == Client("Kim", 1234)) // true
println(moved)
```

`data`는 주 생성자 프로퍼티를 기준으로 `equals`, `hashCode`, `toString`, `copy`, `componentN`을 생성합니다. 주 생성자 밖의 프로퍼티는 값 비교에 포함되지 않는다는 점을 기억해야 합니다. 값 객체라면 `val`로 불변성을 유지하는 편이 복사와 동시성 측면에서 다루기 쉽습니다.

## `sealed` 계층으로 상태를 닫기

```kotlin
sealed class Expr {
    data class Num(val value: Int) : Expr()
    data class Sum(val left: Expr, val right: Expr) : Expr()
}

fun eval(expr: Expr): Int = when (expr) {
    is Expr.Num -> expr.value
    is Expr.Sum -> eval(expr.left) + eval(expr.right)
}
```

가능한 하위 타입이 제한되어 있으므로 컴파일러가 `when`의 완전성을 검사합니다. 상태 머신이나 결과 타입처럼 가능한 경우를 빠짐없이 처리해야 하는 모델에 적합합니다.

## 클래스 위임으로 전달 코드 제거

데코레이터가 인터페이스의 모든 메서드를 내부 객체로 전달하면 준비 코드가 길어집니다. `by`는 이 전달 구현을 생성합니다.

```kotlin
class CountingSet<T>(
    private val inner: MutableCollection<T> = HashSet(),
) : MutableCollection<T> by inner {
    var objectsAdded: Int = 0
        private set

    override fun add(element: T): Boolean {
        objectsAdded++
        return inner.add(element)
    }

    override fun addAll(elements: Collection<T>): Boolean {
        objectsAdded += elements.size
        return inner.addAll(elements)
    }
}

val set = CountingSet<Int>()
set.addAll(listOf(1, 1, 2))
println("${set.objectsAdded}번 추가, ${set.size}개 저장")
```

기본 동작은 `inner`로 위임하고 바꿔야 할 메서드만 오버라이드합니다. 구현 상속 없이 동작을 조합할 수 있습니다.

## `object`, 동반 객체와 객체 식

객체 선언은 클래스 선언과 단일 인스턴스 생성을 합칩니다.

```kotlin
object Payroll {
    private val employees = mutableListOf<String>()

    fun add(name: String) {
        employees += name
    }
}
```

클래스별 팩토리는 동반 객체에 둘 수 있습니다.

```kotlin
class Account private constructor(val nickname: String) {
    companion object {
        fun fromEmail(email: String): Account =
            Account(email.substringBefore('@'))
    }
}

val account = Account.fromEmail("dev@example.com")
```

동반 객체도 일반 객체처럼 이름을 갖거나 인터페이스를 구현할 수 있습니다. 반면 객체 식은 사용할 때마다 새 무명 객체를 만듭니다.

```kotlin
val listener = object : java.awt.event.MouseAdapter() {
    override fun mouseClicked(event: java.awt.event.MouseEvent) {
        println(event.point)
    }
}
```

SAM 인터페이스 하나만 구현한다면 람다가 간결하고, 여러 메서드를 재정의하거나 여러 타입을 구현해야 한다면 객체 식이 적합합니다.

## 설계할 때 확인할 것

- 상속이 정말 계약의 일부인지, 아니라면 조합과 위임이 나은지
- 값 객체의 동등성 기준이 주 생성자 프로퍼티와 일치하는지
- 중첩 객체가 바깥 인스턴스를 참조해야 하는지
- 전역 단일 상태가 필요한지, 단순 최상위 함수면 충분한지
- 생성 실패를 `init`에서 즉시 드러낼 수 있는지

이전 글: [02. 람다, 컬렉션과 시퀀스](./02-lambdas-collections-sequences.pub.md)

다음 글: [04. 고차 함수, 인라인과 제네릭](./04-higher-order-functions-generics.pub.md)
