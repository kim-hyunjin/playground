package convention

import java.beans.PropertyChangeListener
import java.beans.PropertyChangeSupport
import kotlin.reflect.KProperty

/**
 * 프로퍼티 위임 관례를 따르는 Delegate 클래스는 getValue 와 setValue 메소드(변경 가능한 프로퍼티인 경우)를 제공해야 한다.
 *
 * 위임 프로퍼티 사용: by lazy()를 사용한 프로퍼티 초기화 지연
 * lazy 함수의 인자는 값을 초기화할 때 호출할 람다
 * 기본적으로 스레드 안전하다.
 *
 */

class Email {}

fun loadEmails(person: Person2): List<Email> {
    println("${person.name}의 이메일을 가져옴")
    return listOf()
}

fun loadEmails(person: Person3): List<Email> {
    println("${person.name}의 이메일을 가져옴")
    return listOf()
}

// backing property 기법 사용
class Person2(val name: String) {
    private var _emails: List<Email>? = null
    val emails: List<Email>
        get() {
            if (_emails == null) {
                _emails = loadEmails(this)
            }
            return _emails!!
        }
}

// 위임 프로퍼티 사용
class Person3(val name: String) {
    val emails by lazy { loadEmails(this) }
}

open class PropertyChangeAware {
    protected val changeSupport = PropertyChangeSupport(this)

    fun addPropertyChangeListener(listener: PropertyChangeListener) {
        changeSupport.addPropertyChangeListener(listener)
    }

    fun removePropertyChangeListener(listener: PropertyChangeListener) {
        changeSupport.removePropertyChangeListener(listener)
    }
}

// 프로퍼티 변경 통지 직접 구현
class Person4(val name: String, age: Int, salary: Int) : PropertyChangeAware() {
    var age: Int = age
        set(newValue) {
            val oldValue = field
            field = newValue
            changeSupport.firePropertyChange("age", oldValue, newValue)
        }

    var salary: Int = salary
        set(newValue) {
            val oldValue = field
            field = newValue
            changeSupport.firePropertyChange("salary", oldValue, newValue)
        }
}

class ObservableProperty(val propName: String, var propValue: Int, val changeSupport: PropertyChangeSupport) {
    fun getValue(): Int = propValue
    fun setValue(newValue: Int) {
        val oldValue = propValue
        propValue = newValue
        changeSupport.firePropertyChange(propName, oldValue, newValue)
    }
}

// 도우미 클래스 사용
class Person5(val name: String, age: Int, salary: Int) : PropertyChangeAware() {
    val _age = ObservableProperty("age", age, changeSupport)
    var age: Int
        get() = _age.getValue()
        set(value) {
            _age.setValue(value)
        }

    val _salary = ObservableProperty("salary", salary, changeSupport)
    var salary: Int
        get() = _salary.getValue()
        set(value) {
            _salary.setValue(value)
        }
}

class ObservableProperty2(var propValue: Int, val changeSupport: PropertyChangeSupport) {
    operator fun getValue(p: Person6, prop: KProperty<*>): Int = propValue
    operator fun setValue(p: Person6, prop: KProperty<*>, newValue: Int) {
        val oldValue = propValue
        propValue = newValue
        changeSupport.firePropertyChange(prop.name, oldValue, newValue)
    }
}

/**
 * 위임 프로퍼티 사용
 * by 키워드를 사용해 위임 객체를 지정하면 이전 예제에서 직접 코드를 짜야했던 여러 작업을 코틀린 컴파일러가 자동으로 해준다.
 * by 오른쪽에 오는 객체를 위임 객체라고 부른다.
 * 코틀린은 위임 객체를 감춰진 프로퍼티에 저장하고, 주 객체의 프로퍼티를 읽거나 쓸 때마다 위임 객체의 getValue와 setValue를 호출해준다.
 */
class Person6(val name: String, age: Int, salary: Int): PropertyChangeAware() {
    var age: Int by ObservableProperty2(age, changeSupport)
    var salary: Int by ObservableProperty2(salary, changeSupport)
}

// 값을 맵에 저장하는 프로퍼티
class Person7 {
    private val _attributes = hashMapOf<String, String>()
    fun setAttribute(attrName: String, value: String) {
        _attributes[attrName] = value
    }

    // 필수 정보
    val name: String
    get() = _attributes["name"]!!
}

// 위임 프로퍼티 사용하기
class Person8 {
    private val _attributes = hashMapOf<String, String>()
    fun setAttribute(attrName: String, value: String) {
        _attributes[attrName] = value
    }

    /**
     * 표준라이브러리가 Map과 MutableMap 인터페이스에 대해 getValue, setValue 확장 함수를 제공한다.
     * p.name은 _attributes.getValue(p, prop)을 호출하고,
     * _attributes.getValue(p, prop)은 다시 _attributes[prop.name]을 통해 구현된다.
     */
    val name: String by _attributes
}

fun main() {
    val p = Person2("Alice")
    p.emails

    val p4 = Person4("Dmitry", 34, 2000)
    p4.addPropertyChangeListener(
        PropertyChangeListener { event -> println("Property ${event.propertyName} changed " + "from ${event.oldValue} to ${event.newValue}") }
    )
    p4.age = 35

    val p7 = Person7()
    val data = mapOf("name" to "Dmitry", "company" to "JetBrains")
    for ((attrName, value) in data) {
        p7.setAttribute(attrName, value)
    }
    println(p7.name)
}