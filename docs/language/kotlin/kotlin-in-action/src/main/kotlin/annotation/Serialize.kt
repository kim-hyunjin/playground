package annotation

import java.lang.StringBuilder
import kotlin.reflect.KAnnotatedElement
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1
import kotlin.reflect.full.createInstance
import kotlin.reflect.full.memberProperties

private fun StringBuilder.serializeObject(obj: Any) {
    append("{")
    obj.javaClass.kotlin.memberProperties.filter {
        it.findAnnotation<JsonExclude>() == null
    }.forEach { prop ->
        serializeObject(prop, obj)
        append(", ")
    }
    append("}")
}

private fun StringBuilder.serializeObject(prop: KProperty1<Any, *>, obj: Any) {
    val jsonName = prop.findAnnotation<JsonName>()
    val propName = jsonName?.name ?: prop.name
    append(propName)
    append(": ")
    val value = prop.get(obj)
    // 프로퍼티에 정의된 커스텀 직렬화기가 있으면 그 커스텀 직렬화기 사용
    val jsonValue = prop.getSerializer()?.toJsonValue(value) ?: value
    append(jsonValue)
}


fun KProperty<*>.getSerializer(): ValueSerializer<Any?>? {
    val customSerializer = findAnnotation<CustomSerializer>() ?: return null
    val serializerClass = customSerializer.serializerClass
    // 객체에는 object 선언에 의해 생성된 싱글턴을 가리키는 objectInstance 라는 프로퍼티가 있다.
    val valueSerializer = serializerClass.objectInstance ?: serializerClass.createInstance()
    @Suppress("UNCHECKED_CAST")
    return valueSerializer as ValueSerializer<Any?>
}

// buildString은 StringBuilder를 생성해서 인자로 받은 람다에 넘긴다.
fun serialize(obj: Any): String = buildString { serializeObject(obj) }

// annotations는 소스 상 해당 요소에 적용된 (@Retention을 RUNTIME으로 지정한) 모든 애노테이션 인스턴스의 콜렉션이다.
inline fun <reified T> KAnnotatedElement.findAnnotation(): T? = annotations.filterIsInstance<T>().firstOrNull()

data class Person5(
    @JsonName("alias") val firstName: String,
    val age: Int,
    @JsonExclude val temp: String
)

fun main() {
    val person = Person5("Alice", 29, "temp")
    val kClass = person.javaClass.kotlin

    // JsonExclude 애노테이션이 없는 프로퍼티만 가져오기
    val properties = kClass.memberProperties.filter { it.findAnnotation<JsonExclude>() == null }
    println(properties)
}