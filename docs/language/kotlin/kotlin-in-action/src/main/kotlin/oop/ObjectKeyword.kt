package oop

import java.io.File
import java.lang.Exception

/**
 * 코틀린에서 object 키워드를 다양한 상황에서 사용하지만
 * 모든 경우 클래스를 정의하면서 동시에 인스턴스를 생성하다는 공통점이 있다.
 * - 객체 선언은 싱글턴을 정의하는 방법 중 하나다.
 * - 동반 객체는 인스턴스 메소드는 아니지만 어떤 클래스와 관련 있는 메소드와 팩토리 메소드를 담을 때 쓰인다.
 *   동반 객체 메소드에 접근할 때는 동반 객체가 포함된 클래스의 이름을 사용할 수 있다.
 * - 객체 식은 자바의 무명 내부 클래스 대신 쓰인다.
 */

/**
 * 코틀린은 객체 선언 기능을 통해 싱글턴을 언어에서 기본 지원한다.
 * 객체 선언은 클래스 선언과 그 클래스에 속한 단일 인스턴스의 선언을 합친 선언이다.
 *
 * 객체 선언은 object 키워드로 시작한다.
 *
 * 프로퍼티, 메소드, 초기화 블록 등이 들어갈 수 있다.
 * 하지만 생성자는 객체 선언에 쓸 수 없다.
 *
 * 싱글턴 객체는 객체 선언문이 있는 위치에서 생성자 호출 없이 즉시 만들어진다.
 */
object Payroll {
    val allEmployees = arrayListOf<Person>()
    fun calculateSalary() {
        for (person in allEmployees) {
            /**/
        }
    }
}

/**
 * 객체 선언도 클래스나 인터페이스를 상속할 수 있다.
 */
object CaseInsensitiveFileComparator: Comparator<File> {
    override fun compare(o1: File?, o2: File?): Int {
        if (o1 != null && o2 != null) {
            return o1.path.compareTo(o2.path)
        }
        throw NullPointerException("파일이 올바르지 않습니다.")
    }
}

/**
 * 클래스 안에서 object를 선언할 수도 있다. 그런 객체도 인스턴스는 하나뿐이다.
 * (클래스의 인스턴스마다 중첩 객체 선언에 해당하는 인스턴스가 따로 생기는 것이 아니다)
 */
data class Person(val name: String) {
    object NameComparator: Comparator<Person> {
        override fun compare(o1: Person?, o2: Person?): Int = o1!!.name.compareTo(o2!!.name)
    }
}

fun main() {
    // 변수와 마찬가지로 객체 선언에 사용한 이름 뒤에 마침표를 붙이면 객체에 속한 메소드나 프로퍼티에 접근할 수 있다.
    Payroll.allEmployees.add(Person("hyunjin"))
    Payroll.calculateSalary()

    val persons = listOf(Person("kim"), Person("Alice"))
    println(persons.sortedWith(Person.NameComparator))
}