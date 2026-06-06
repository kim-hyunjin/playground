package com.github.kimhyunjin.basicsyntax

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import java.lang.IllegalArgumentException
import java.util.*

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d("BasicSyntax", "로그를 출력합니다. method = Log.d")
        var myName = "홍길동"
        var myAge: Int
        myAge = 27
        myAge = myAge + 1
        Log.d("BasicSyntax", "myName = $myName, myAge = $myAge")

        var ball = 4
        if (ball > 3) {
            Log.d("ControlFlow", "4볼로 출루합니다.")
        } else {
            Log.d("ControlFlow", "타석에서 다음 타구를 기다립니다.")
        }

        var eraOfRyu = 2.32
        var eraOfDegrom = 2.43

        val era = if (eraOfRyu < eraOfDegrom) {
            Log.d("MLB_RESULT", "2019 류현진이 디그롬을 이겼습니다.")
            eraOfRyu // 마지막 값을 era에 할당
        } else {
            Log.d("MLB_RESULT", "2019 디그롬이 류현진을 이겼습니다.")
            eraOfDegrom
        }

        Log.d("MLB_RESULT", "2019 MLB에서 가장 높은 ERA는 ${era}입니다.")

        var now = 10
        when (now) {
            8 -> {
                Log.d("when", "현재 시간은 8시입니다.")
            }
            9 -> {
                Log.d("when", "현재 시간은 9시입니다.")
            }
            else -> {
                Log.d("when", "현재 시간은 9시가 아닙니다.")
            }
        }

        now = 9
        when (now) {
            8, 9 -> { // 콤마(,)를 사용해 한 번에 비교할 수도 있다.
                Log.d("when", "현재 시간은 8시 또는 9시입니다.")
            }
            else -> {
                Log.d("when", "현재 시간은 9시가 아닙니다.")
            }
        }

        /* in으로 범위 값을 비교할 수 있다. */
        var ageOfMichael = 19
        when (ageOfMichael) {
            in 10..19 -> {
                Log.d("when", "마이클은 10대입니다.")
            }
            !in 10..19 -> {
                Log.d("when", "마이클은 10대가 아닙니다.")
            }
            else -> {
                Log.d("when", "마이클의 현재 나이를 알 수 없습니다.")
            }
        }

        /* 파라미터 없는 when */
        var currentTime = 6
        when {
            currentTime == 5 -> {
                Log.d("when", "현재 시간은 5시입니다.")
            }
            currentTime > 5 -> {
                Log.d("when", " 현재 시간은 5시가 넘었습니다.")
            }
            else -> {
                Log.d("when", "현재 시간은 5시 이전입니다.")
            }
        }

        /* 배열 */
        var intArr = IntArray(10)
        var longArr = LongArray(10)
        var charArr = CharArray(10)
        var floatArr = FloatArray(10)
        var doubleArr = DoubleArray(10)
        var stringArr = Array(10) { "" }
        var dayArr = arrayOf("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN")

        intArr[0] = 90
        intArr.set(1, 91)
        intArr[9] = 99
        var firstValue = intArr[0]
        var tenthValue = intArr.get(9)

        /* 컬렉션
        * 코틀린은 기본 컬렉션 데이터 타입을 모두 immutable로 설계했다.
        * 따라서 컬렉션의 원래 용도인 동적 배열로 사용하기 위해서는 mutable로 만들어진
        * 데이터 타입을 사용해야 한다.
        * */
        // 리스트(list)
        var list = mutableListOf("MON", "TUE", "WED")
        list.add("THU") // 값 추가하기
        var mon = list.get(0) // 값 조회하기
        list.set(3, "목") // 값 수정하기
        list.removeAt(1) // 값 제거하기
        Log.d("Collection", "list 전체 개수 : ${list.size}")

        // 셋(set)
        var set = mutableSetOf<String>()
        set.add("JAN")
        set.add("FEB")
        set.add("FEB") // 중복된 값은 추가되지 않습니다.
        Log.d("Collection", "Set 전체 출력 = $set")

        // 맵(map)
        var map = mutableMapOf<String, String>()
        map.put("key1", "value1") // 값 추가하기
        map["key2"] = "value2"
        map["key3"] = "value3"
        Log.d("Collection", "map에 입력된 key1의 값은 ${map.get("key1")}입니다.")
        Log.d("Collection", "map에 입력된 key2의 값은 ${map["key2"]}입니다.")

        map.put("key2", "updatedValue") // 수정하기
        map.remove("key3")

        // immutable collection
        val IMMUTABLE_LIST = listOf("JAN", "FEB", "MAR")
        val DAY_LIST = listOf("월", "화", "수", "목", "금", "토", "일")

        /* 반복문 */
        for (i in 1..10) {
            Log.d("For", "현재 숫자는 $i")
        }
        // 마지막 숫자 제외
        for (i in 0 until DAY_LIST.size) {
            Log.d("For", "현재 월은 ${DAY_LIST.get(i)}입니다.")
        }
        // 건너뛰기
        for (i in 3..100 step 3) {
            Log.d("For", "3의 배수: $i")
        }
        // 1씩 감소
        for (i in 10 downTo 0) {
            Log.d("For", "1씩감소: $i")
        }
        // 배열 순회
        for (day in DAY_LIST) {
            Log.d("For", "배열 순회 - $day")
        }

        /* while */
        var current = 1
        var until = 12
        while (current < until) {
            Log.d("while", "현재 값은 $current")
            current = current + 1
        }

        /* do while */
        var game = 1
        var match = 6
        do {
            Log.d("while", "${game}게임 이겼습니다. 우승까지 ${match - game}게임 남았습니다.")
            game += 1
        } while (game < match)

        // break
        for (i in 1..10) {
            Log.d("break", "현재 인덱스 $i")
            if (i > 5) break
        }

        for (i in 1..10) {
            if (i > 3 && i < 8) {
                continue
            }
            Log.d("continue", "현재 인덱스 $i")
        }

        var squareResult = square(30)
        Log.d("fun", "30의 제곱은 $squareResult")
        printSum(3, 5)
        val PI = getPi()
        Log.d("fun", "지금이 10인 원의 둘레는 ${10 * PI}")

        var parent = Parent()
        parent.sayHello()
        var child = Child()
        child.sayHello()

        var myClass = MyClass()
        myClass.testStringExtension()

        /* null safety */
        var nullable: String?
        nullable = null
        nullable = nullParameter("abc")
        var length = nullable?.length // 안전한 호출 - 해당 변수가 null인 경우 null을 반환

        /* elvis operator */
        var notNullLength: Int
        notNullLength = nullable?.length ?: 0 // length가 없을 경우 0

        /* 스코프 함수 */
        // run - 스코프 함수 안에서 호출한 대상을 this로 사용할 수 있다.
        // 클래스 내부의 함수를 사용하는 것과 동일한 효과
        // 마지막 실행 코드를 결과로 반환
        val lastItem = list.run {
            val listSize = size // this(== list)를 생략한 채로 바로 사용
            println("리스트의 길이 run = $listSize")
            get(listSize - 1)
        }

        // apply는 결과로 자기 자신을 되돌려준다.
        val addedList = list.apply {
            val listSize = size
            add("Apply")
            print(listSize)
        }

        // 마지막 실행 코드를 결과로 반환
        with(list) {
            val listSize = size
            get(listSize - 1)
        }

        // let - 함수 영역 안에서 호출한 대상을 it으로 사용할 수 있다.
        // 마지막 실행 코드를 결과로 반환
        list.let {
            val listSize = it.size
            it.get(listSize - 1)
        }

        // apply처럼 자기 자신을 되돌려준다.
        list.also {
            val listSize = it.size
            it.add("Apply")
        }
    }

    // 함수 파라미터는 모두 읽기 전용 키워드 val이 생략된 형태이다.
    fun square(x: Int): Int {
        return x * x
    }

    fun printSum(x: Int, y: Int) {
        Log.d("fun", "x + y = ${x + y}")
    }

    fun getPi(): Double {
        return 3.14
    }

    // 파라미터 기본 값 설정
    fun newFn(name: String, age: Int = 29, weight: Double = 65.5) {
        // ...
    }

    fun nullParameter(str: String?): String? {
        if (str != null) {
            var length2 = str.length
            return "$length2"
        }
        return null
    }
}

/* 클래스 */
class Person(value: String) {
    init {
        Log.d("class", "생성자로부터 전달받은 값은 $value")
    }
}

// 생성사 파라미터 앞에 val 키워드를 붙여 따로 초기화 작업 없이 클래스 스코프 내에서 사용
class Person2(val value: String) {
    fun process() {
        print(value)
    }
}

// 세컨더리 생성자
class Kotlin {

    constructor(value: String) {

    }

    constructor(value: Int) {

    }

    constructor(value1: Int, value2: String)
}

class Student { // 생성자를 작성하지 않을 경우 파라미터가 없는 프라이머리 생성자가 하나 있는 것과 동일
    init {
        // 기본 생성자가 없더라도 초기화가 필요하면 여기에 코드를 작성
    }
    // init -> 세컨더리 생성자 순으로 실행
}

/*
    오브젝트
    앱 전체에 한개만 생성
    생성자 없이 직접 호출
*/

object Pig {
    var name: String = "Pinky"
    fun printName() {
        Log.d("class", "Pig의 이름은 ${name}입니다.")
    }
}

/* 컴패니언 오브젝트 */
class PigClass {
    // name과 printName은 생성자 없이 사용가능
    companion object {
        var name: String = "None"
        fun printName() {
            Log.d("class", "Pig의 이름은 ${Pig.name}입니다.")
        }
    }

    // walk()는 생성자로 인스턴스를 만든 후 사용 가능
    fun walk() {
        Log.d("class", "Pig가 걸어갑니다.")
    }
}

/* 데이터 클래스 */
// 주로 코드 블록을 사용하지 않고 간단하게 작성
data class UserData(val name: String, var age: Int)

// 일반 클래스 처럼 사용
data class UserData2(var name: String, var age: Int) {
    init {
        Log.d("UserData", "init")
    }

    fun process() {
        // 클래스와 동일하게 메서드 사용이 가능하다.
    }
}

/* 클래스 상속 */
// open 키워드가 있어야 상속 가능
open class Parent {
    var hello: String = "안녕하세요."
    fun sayHello() {
        Log.d("inheritance", "$hello")
    }
}

class Child : Parent() {
    fun myHello() {
        hello = "My Hello!"
        sayHello()
    }
}

/* 오버라이드 */
open class BaseClass {
    // open 키워드가 있어야 오버라이드 가능
    open var open: String = "I am"
    open fun opened() {

    }

    fun notOpened() {

    }
}

class ChildClass : BaseClass() {
    override var open: String = "You are"
    override fun opened() {

    }
}

/* 익스텐션 */
class MyClass {
    fun testStringExtension() {
        var original = "hello"
        var added = "Guys~"
        Log.d("Extension", "added를 더한 값은 ${original.plus(added)}")
    }
}

// 기존 클래스에 메서드를 추가하는 개념
fun String.plus(word: String): String {
    return this + word
}

/* 추상 클래스 */
abstract class Animal {
    fun walk() {
        Log.d("abstract", "걷습니다.")
    }

    abstract fun move()
}

class Bird : Animal() {
    override fun move() {
        Log.d("abstract", "날아서 이동합니다.")
    }
}

/* 인터페이스 */
interface InterfaceKotlin {
    // abstract 키워드가 생략되어 있다.
    var variable: String
    fun get()
    fun set()
}

class KotlinImpl : InterfaceKotlin {
    override var variable: String = "Init"

    override fun get() {
        TODO("Not yet implemented")
    }

    override fun set() {
        TODO("Not yet implemented")
    }
}

// object 키워드를 사용해 클래스의 상속 형태가 아닌 직접 구현
var kotlinImpl = object : InterfaceKotlin {
    override var variable: String = "Init"

    override fun get() {
        TODO("Not yet implemented")
    }

    override fun set() {
        TODO("Not yet implemented")
    }

}

/*
    lateinit
    - var로 선언된 클래스의 프로퍼티에만 사용 가능.
    - null은 허용되지 않는다.
    - 기본 자료형은 사용할 수 없다.
*/
class Person3 {
    var name: String? = null

    init {
        name = "Lionel"
    }

    // safe call이 남용되어 가독성을 떨어트린다.
    fun process() {
        name?.plus(" Messi")
        print("이름의 길이 = ${name?.length}")
        print("이름의 첫 글자 = ${name?.substring(0, 1)}")
    }
}

class Person4 {
    lateinit var name: String

    init {
        name = "Lionel"
    }

    fun process() {
        name.plus(" Messi")
        print("이름의 길이 = ${name.length}")
        print("이름의 첫 글자 = ${name.substring(0, 1)}")
    }
}

/*
    lazy
    읽기 전용 변수인 val을 사용하는 지연 초기화
*/
class Company {
    // 선언 시에 초기화 코드를 함께 작성하기 때문에 따로 초기화할 필요 없다.
    val person: Person4 by lazy { Person4() }

    // process함수가 호출되어서 process.name이 호출되는 순간에 person이 초기화된다.(lazy)
    fun process() {
        print("person의 이름은 ${person.name}")
    }
}

/*
 *  getter setter
 */

class Car() {
    lateinit var owner: String

    val myBrand: String = "BMW"
        // Custom getter
        get() {
            return field.lowercase(Locale.ROOT)
        }

    var maxSpeed: Int = 250
        // Custom setter
        set(value) {
            field =
                if (value > 0) value else throw IllegalArgumentException("Max speed can not be less than zero.")
        }

    var myModel: String = "M5"
        private set

    init {
        this.owner = "Frank"
        this.myModel = "M3"
    }
}