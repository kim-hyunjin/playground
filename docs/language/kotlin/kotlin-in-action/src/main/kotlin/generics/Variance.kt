package generics

import java.lang.IllegalArgumentException
import java.util.*
import kotlin.collections.ArrayList
import kotlin.reflect.KClass

/**
 * 변성: 제네릭과 하위 타입
 */
fun printContents(list: List<Any>) {
    println(list.joinToString())
}

fun addAnswer(list: MutableList<Any>) {
    list.add(42)
}

/**
 * 공변성: 하위 타입 관계를 유지
 * 코틀린에서 제네릭 클래스가 타입 파라미터에 대해 공변적임을 표시하려면 앞에 out을 넣어야한다.
 * 타입 파라미터를 공변적으로 만들면 함수 정의에 사용한 파라미터 타입과 타입 인자이 타입이 정확히 일치하지 않더라도 그 클래스의 인스턴스를 함수 인자나 반환값으로 사용할 수 있다.
 */
interface Producer<out T> {
    fun produce(): T
}

open class Animal {
    fun feed() {}
}

class Cat: Animal() {
    fun cleanLitter() {}
}

/**
 * 무공변 컬렉션
 */
class Herd<T: Animal> : ArrayList<T>() {
}

fun feedAll(animals: Herd<Animal>) {
    for (i in 0 until animals.size) {
        animals[i].feed()
    }
}

fun takeCareOfCats(cats: Herd<Cat>) {
    for (i in 0 until cats.size) {
        cats[i].cleanLitter()
    }
    // feedAll(cats) // 타입 불일치 오류
}

/**
 * 공변적 컬렉션
 */
class Herd2<out T: Animal>(animals: List<T>) {
    private val _animals = animals

    val size: Int get() = _animals.size
    operator fun get(i: Int): T {
        return _animals[i]
    }

//    fun add(animal: T) {} // T는 out 위치에서만 쓰일 수 있다.
}

fun feedAll(animals: Herd2<Animal>) {
    for (i in 0 until animals.size) {
        animals[i].feed()
    }
}

fun takeCareOfCats(cats: Herd2<Cat>) {
    for (i in 0 until cats.size) {
        cats[i].cleanLitter()
    }
     feedAll(cats)
}

/**
 * 타입 파라미터에 붙은 out 키워드는 다음 두 가지를 함께 의미한다.
 * - 공변성: 하위 타입 관계가 유지된다. Producer<Cat>은 Producer<Animal>의 하위타입이다.
 * - 사용 제한: T를 아웃 위치에서만 사용할 수 있다.
 *
 * 변성은 코드에서 위험할 여지가 있는 메소드를 호출할 수 없게 만듦으로써
 * 제네릭 타입의 인스턴스 역할을 하는 클래스 인스턴스를 잘못 사용하는 일이 없게 방지하는 역할을 한다.
 *
 * 변성 규칙은 클래스 외부의 사용자가 클래스를 잘못 사용하는 일을 막기 위한 것으로
 * 클래스 내부 구현에는 적용되지 않는다.(private 메소드의 파라미터는 인도 아니고 아웃도 아니다)
 */

fun main() {
    printContents(listOf("abc", "bac"))

    val strings = mutableListOf("abc", "bac")
//    addAnswer(strings) // 코틀린에서는 리스트의 변경 가능성에 따라 적절한 인터페이스를 선택하면 안전하지 못한 함수 호출을 막을 수 있다.
//    println(strings.maxBy { it.length })
    val ints = mutableListOf(1, 2, 3)
    val anyItems = mutableListOf<Any>()
    copyData2(ints, anyItems) // Int가 Any의 하위 타입이므로 이 함수를 호출할 수 있다.
    println(anyItems)
}

/**
 * 반공변성: 뒤집힌 하위 타입 관계
 *
 * in이라는 키워드는 그 키워드가 붙은 타입이 이 클래스의 메소드 안으로 전달돼 메소드에 의해 소비된다는 뜻이다.
 * 공변성의 경우와 마찬가지로 타입 파라미터의 사용을 제한함으로써 특정 하위 타입 관계에 도달할 수 있다.
 * in 키워드를 타입 인자에 붙이면 그 타입 인자를 오직 인 위치에서만 사용할 수 있다는 뜻이다.
 */
interface Comparator<in T> {
    fun compare(e1: T, e2: T): Int {
        return 0
    }
}

interface Function1<in P, out R> {
    operator fun invoke(p: P): R
}
/**
 * 사용 지점 변성: 타입이 언급되는 지점에서 변성 지정
 *
 * 코틀린 선언 지점 변성과 자바 와일드카드 비교
 * 선언 지점 변성을 사용하면 변성 변경자를 단 한번만 표시하고 클래스를 쓰는 쪽에서 변성에 대해 신경을 쓸 필요가 없으므로 코드가 더 간결해진다.
 *
 * 자바
 * public interface Stream {
 *  <R> Stream <R> map(Function<? super T, ? extends R> mapper);
 * }
 */
fun <T> copyData(source: MutableList<T>, destination: MutableList<T>) { // 무공변
    for (item in source) {
        destination.add(item)
    }
}

fun <T: R, R> copyData2(source: MutableList<T>, destination: MutableList<R>) {
    for (item in source) {
        destination.add(item)
    }
}

/**
 * out 키워드를 붙여 T 타입을 in 위치에 사용하는 메소드를 호출하지 않는다는 뜻이다.
 * 이때 타입 프로젝션(type projection)이 일어난다.
 * source를 일반적인 MutableList가 아니라 이에 제약을 가한 타입으로 만든다.
 * 이 경우 MutableList의 메소드 중 T 타입을 반환하는 메소드만 호출 할 수 있다.
 */
fun <T> copyData3(source: MutableList<out T>, destination: MutableList<T>) {
    for (item in source) {
        destination.add(item)
    }
}

// source 리스트 원소 타입의 상위 타입을 destination 리스트 원소 타입으로 혀용한다.
fun <T> copyData4(source: MutableList<T>, destination: MutableList<in T>) {
    for (item in source) {
        destination.add(item)
    }
}

/**
 * MutableList<out T>는 자바의 MutableList<? extends T>와 같고
 * MutableList<in T>는 자바 MutableList<? super T>와 같다.
 */

/**
 * 스타 프로젝션: 타입 인자 대신 * 사용
 * MutableList<Any?>는 모든 타입의 원소를 담을 수 있다는 사실을 알 수 있는 리스트.
 * MutableList<*>는 어떤 원소 타입을 담는 리스트지만 그 타입을 정확히 모른다는 사실을 표현.
 *
 */
fun starProjection() {
    val list: MutableList<Any?> = mutableListOf('a', 1, "qwe")
    val chars = mutableListOf('a', 'b', 'c')
    val unknownElements: MutableList<*> = if (Random().nextBoolean()) list else chars
    // unknownElements.add(42) // 에러
    /**
     * MutableList<*>는 MutableList<out Any?>처럼 동작한다.
     * => 어떤 리스트의 원소 타입을 몰라도 안전하게 Any? 타입의 원소를 꺼내올 수는 있지만
     *    타입을 모르는 리스트에 마음대로 넣을 수는 없다.
     *
     * 코틀린의 MyType<*>는 자바의 MyType<?>에 대응한다.
     */

    val validators = mutableMapOf<KClass<*>, FieldValidator<*>>()
    validators[String::class] = DefaultStringValidator
    validators[Int::class] = DefaultIntValidator

//    validators[String::class]!!.validate("") // FieldValidator<*>에 구체적인 타입인 String을 넣을 수 없어 에러
    val stringValidator = validators[String::class] as FieldValidator<String> // 안전하지 않은 타입 캐스트
    println(stringValidator.validate(""))

    Validators.registerValidator(String::class, DefaultStringValidator)
    Validators.registerValidator(Int::class, DefaultIntValidator)
    println(Validators[String::class].validate("Kotlin"))
    println(Validators[Int::class].validate(42))
}

interface FieldValidator<in T> {
    fun validate(input: T): Boolean
}

object DefaultStringValidator: FieldValidator<String> {
    override fun validate(input: String): Boolean {
        return input.isNotEmpty()
    }
}

object DefaultIntValidator: FieldValidator<Int> {
    override fun validate(input: Int): Boolean {
        return input >= 0
    }
}

object Validators {
    private val validators = mutableMapOf<KClass<*>, FieldValidator<*>>()

    fun <T: Any> registerValidator(
        kClass: KClass<T>, fieldValidator: FieldValidator<T>
    ) {
        validators[kClass] = fieldValidator
    }

    @Suppress("UNCHECKED_CAST")
    operator fun <T: Any> get(kClass: KClass<T>): FieldValidator<T> {
        return validators[kClass] as? FieldValidator<T>
            ?: throw IllegalArgumentException("No validator for ${kClass.simpleName}")
    }
}

