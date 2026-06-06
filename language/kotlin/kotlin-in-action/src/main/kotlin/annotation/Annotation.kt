package annotation

import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*
import kotlin.reflect.KClass

/**
 * 애노테이션과 리플렉션을 사용하면 미리 알지 못하는 임의의 클래스를 다룰 수 있다.
 * 애노테이션을 사용하면 라이브러리가 요구하는 의미를 클래스에게 부여할 수 있고,
 * 리플렉션을 사용하먄 실행 시점에 컴파일러 내부 구조를 분석할 수 있다.
 *
 * 코틀린의 애노테이션 문법
 * - 클래스를 애노테이션 인자로 지정할 때는 @MyAnnotation(MyClass::class) 처럼 ::class를 클래스 이름 뒤에 넣어야 한다.
 * - 다른 애노테이션을 인자로 지정할 때는 인자로 들어가는 애노테이션 앞에 @룰 넣지 않는다.
 * - 배열을 인자로 지정하려면 @RequestMapping(path=arrayOf("/foo", "/bar")) 처럼 arrayOf 함수를 사용한다.
 *
 * 애노테이션 인자를 컴파일 시점에 알 수 있어야 한다. 따라서 임의의 프로퍼티를 인자로 지정할 수는 없다.
 * 프로퍼티를 애노테이션 인자로 사용하려면 그 앞에 const 변경자를 붙여야 한다.
 * 컴파일러는 const가 붙은 프로퍼티를 컴파일 시점 상수로 취급한다.
 * const val TEST_TIMEOUT = 100L
 * @Test(timeout=TEST_TIMEOUT) fun testMethod() {}
 *
 * const 가 붙은 프로퍼티는 파일의 맨 위나 object 안에 선언해야 하며,
 * 원시 타입이나 String 으로 초기화해야만 한다.
 */

data class Person(
    @JsonName("alias") val firstName: String,
    @JsonExclude val age: Int? = null
)

/**
 * 메타 애노테이션: 애노테이션을 처리하는 방법을 제어
 * 자바와 마찬가지로 코틀린 애노테이션 클래스도 애노테이션을 붙일 수 있다.
 * 이를 메타애노테이션이라고 부른다.
 * 컴파일러가 애노테이션을 처리하는 방법을 제어한다.
 */
@Target(AnnotationTarget.PROPERTY) // 가장 흔히 쓰이는 메타 애노테이션. 애노테이션 적용가능 대상을 지정.
annotation class JsonExclude
annotation class JsonName(val name: String)
/*
* 자바
* public @interface JsonName {
*   String value(); // 자바에서 value 메소드는 특별하다. 어떤 애노테이션을 적용할 때 value를 제외한 모든 애트리뷰트에는 이름을 명시해야 한다.
* }
* */

/**
 * 애노테이션 파라미터로 클래스 사용
 *
 * 어떤 클래스를 선언 메타데이터로 참조할 수 있는 기능.
 *
 * 클래스 참조를 파라미터로 하는 애노테이션 클래스를 선언하면 사용할 수 있다.
 */
interface Company {
    val name: String
}

data class CompanyImpl(override val name: String): Company

// Person2 인스턴스를 역직렬화 하는 과정에서 company 프로퍼티를 표현하는 JSON을 읽으면
// 그 프로퍼티 값에 해당하는 JSON을 역직렬화하면서
// CompanyImpl의 인스턴스를 만들어서 Person2 인스턴스의 company 프로퍼티에 설정한다.
data class Person2(
    val name: String,
    @DeserializeInterface(CompanyImpl::class) val company: Company
)

// KClass는 자바 java.lang.Class 타입과 같은 역할을 하는 코틀린 타입이다.
// 코틀린 클래스에 대한 참조를 저장할 때 KClass 타입을 사용한다.
// KClass의 타입 파라미터에는 이 KClass의 인스턴스가 가리키는 코틀린 타입을 지정한다.
@Target(AnnotationTarget.PROPERTY)
annotation class DeserializeInterface(val targetClass: KClass<out Any>)

/**
 * 애노테이션 파라미터로 제네릭 클래스 받기
 */
interface ValueSerializer<T> {
    fun toJsonValue(value: T): Any?
    fun fromJsonValue(jsonValue: Any?): T
}

class DateSerializer: ValueSerializer<Date> {
    override fun toJsonValue(value: Date): Any? {
        val df: DateFormat = SimpleDateFormat("yyyy-MM-dd")
        return """
            {
                date: "${df.format(value)}"
            }
        """.trimIndent()
    }

    override fun fromJsonValue(jsonValue: Any?): Date {
        return SimpleDateFormat("yyyy-MM-dd", Locale.KOREA).parse(jsonValue.toString())
    }
}

data class Person3(
    val name: String,
    @CustomSerializer(DateSerializer::class) val birthDate: Date
)

annotation class CustomSerializer(
    val serializerClass: KClass<out ValueSerializer<*>>
)
/**
 * 클래스를 인자로 받아야 한다면, 애노테이션 파라미터 타입에 KClass<out 허용할 클래스 이름>
 * 제네릭 클래스를 인자로 받아야 한다면, KClass<out 허용할 클래스 이름<*>>
 */