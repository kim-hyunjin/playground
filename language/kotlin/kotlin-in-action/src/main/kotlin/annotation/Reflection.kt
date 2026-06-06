package annotation

import kotlin.reflect.KClass
import kotlin.reflect.KFunction2
import kotlin.reflect.KProperty1
import kotlin.reflect.full.*


/**
 * 간단히 말해 리플렉션은 실행 시점에 (동적으로) 객체의 프로퍼티와 메소드에 접근할 수 있게 해주는 방법이다.
 *
 * 보통 객체의 메소드나 프로퍼티에 접근할 때는 프로그램 소스코드 안에 구체적인 선언이 있는 메소드나 프로퍼티 이름을 사용하며,
 * 컴파일러는 그런 이름이 실제로 가리키는 선언을 컴파일 시점에 (정적으로) 찾아내서 해당하는 선언이 실제 존재함을 보장한다.
 *
 * 하지만 타입과 관계없이 객체를 다뤄야 하거나 객체가 제공하는 메소드나 프로퍼티 이름을 오직 실행 시점에만 알 수 있는 경우가 있다.
 * JSON 직렬화 라이브러리가 그런 경우다. 직렬화 라이브러리는 어떤 객체든 JSON으로 변환할 수 있어야 하고,
 * 실행시점이 되기 전까지는 라이브러리가 직렬화할 프로퍼티나 클래스에 대한 정보를 알 수 없다.
 * 이런 경우 리플렉션을 사용해야 한다.
 *
 * 코틀린에서 리플렉션을 사용하려면 두 가지 서로 다른 리플렉션 API를 다뤄야 한다.
 * 첫 번째는 자바가 java.lang.reflect 패키지를 통해 제공하는 표준 리플렉션이다.
 * 코틀린 클래스는 일반 자바 바이트코드로 컴파일되므로 자바 리플렉션 API도 코틀린 클래스를 컴파일한 바이트코드를 완벽히 지원한다.
 * 이는 리플렉션을 사용하는 자바 라이브러리와 코틀린 코드가 완전히 호환된다는 뜻이므로 특히 중요하다.
 *
 * 두번째 API는 코틀린이 kotlin.reflect 패키지를 통해 제공하는 코틀린 리플렉션 API다.
 * 이 API는 자바에는 없는 프로퍼티나 널이 될 수 있는 타입과 같은 코틀린 고유 개념에 대한 리플렉션을 제공한다.
 * 하지만 현재 코틀린 리플렉션 API는 자바 리플렉션 API를 완전히 대체할 수 있는 복잡한 기능을 제공하지는 않는다.
 * 따라서 나중에 보겠지만 자바 리플렉션을 대안으로 사용해야 하는 경우가 생긴다.
 *
 * 또한 코틀린 리플렉션 API가 코틀린 클래스만 다룰 수 있는 것은 아니라는 점을 잘 알아둬야한다.
 * 코틀린 리플렉션 API를 사용해도 다른 JVM 언어에서 생성한 바이트코드를 충분히 다룰 수 있다.
 */

/**
 * 안드로이드와 같이 런타임 라이브러리 크기가 문제가 되는 플랫폼을 위해 코틀린 리플렉션 API는 kotlin-reflect.jar라는
 * 별도의 .jar 파일에 담겨 제공되며, 새 프로젝트를 생성할 때 리플렉션 패키지 .jar 파일에 대한 의존관계가 자동으로 추가되는 일은 없다.
 * 따라서 코틀린 리플렉션 API를 사용한다면 직접 프로젝트 의존관계에 리플렉션 .jar 파일을 추가해야 한다.
 *
 * 코틀린 리플렉션 패키지의 메이븐 그룹/아티팩트 ID는 org.jetbrains.kotlin:kotlin-reflect 다.
 */

/**
 * 코틀린 리플렉션 API: KClass, KCallable, KFunction, KProperty
 */
class Person4(val name: String, val age: Int)

fun sum(x: Int, y: Int) = x + y

var counter = 0

fun main() {
    val person = Person4("Alice", 29)
    val kClass = person.javaClass.kotlin // KClass<Person4>를 반환한다.
    println(kClass.simpleName)
    kClass.members.forEach { println(it) }

    /**
     * KFunctionN 인터페이스
     * 각 KFunctionN 타입은 KFunction을 확장하며, N과 파라미터 개수가 같은 invoke 메소드를 추가로 포함한다.
     * 예를들어 KFunction2<P1, P2, R>에는 operator fun invoke(p1: P1, p2: P2): R 선언이 들어있다.
     *
     * 이런 함수 타입들은 컴파일러가 생성한 합성 타입이다. 따라서 kotlin.reflect 패키지에서 이런 타입의 정의를 찾을 수는 없다.
     * 코틀린에서는 컴파일러가 생성한 합성 타입을 사용하기 때문에 원하는 수만큼 많은 파라미터를 갖는 함수에 대한 인터페이스를 사용할 수 있다.
     * 합성 타입을 사용하기 때문에 코틀린은 kotlin-runtime.jar 의 크기를 줄일 수 있고,
     * 함수 파라미터 개수에 대한 인위적인 제약을 피할 수 있다.
     *
     */
    val kFunction: KFunction2<Int, Int, Int> = ::sum
    println(kFunction.invoke(1, 2) + kFunction.invoke(3, 4)) // invoke 메소드를 호출할 때 인자 개수나 타입이 안맞으면 컴파일에러

    val kProperty = ::counter
    kProperty.setter.call(21) // 리플렉션 기능을 통해 세터를 호출
    println(kProperty.get())

    val memberProperty: KProperty1<Person4, Int> = Person4::age
    println(memberProperty.get(person))
}