package oop

/**
 * 코틀린은 주 생성자와 부 생성자를 구분한다.
 * 또한 초기화 블록을 통해 초기화로직을 추가할 수 있다.
 *
 * 괄호로 둘러싸인 코드를 주 생성자라고 부른다.
 * 주 생성자는 생성자 파라미터를 저장하고,
 * 그 생성자 파라미터에 의해 초기화되는 프로퍼티를 정의하는 두 가지 목적에 쓰인다.
 *
 * constructor 키워드는 주 생성자나 부 생성자 정의를 시작할 때 사용한다.
 * init 키워드는 초기화 블록을 시작한다.
 * 초기화 블록은 주 생성자와 함께 사용된다.
 * 필요하다면 클래스 안에 여러 초기화 블록을 선언할 수 있다.
 *
 * 프로퍼티 초기화 식이나 초기화 블록 안에서만 주 생성자의 파라미터를 참조할 수 있다.
 */
open class User constructor(val _nickname: String) { // 파라미터가 하나만 있는 주 생성자
   val nickname: String

   init { // 초기화 블록
       nickname = _nickname
   }
}

class User2(val nickname: String, val isSubscribed: Boolean = true)
/*
* 모든 생성자 파라미터에 디폴트 값을 지정하면 컴파일러가 자동으로 파라미터가 없는 생성자를 만들어준다.
* */

/**
 * 클래스에 기반 클래스가 있다면 주 생성자에서 기반 클래스의 생성자를 호출해야 할 필요가 있다.
 * 기반 클래스를 초기화하려면 기반 클래스 이름 뒤에 괄호 치고 생성자 인자를 넘기면 된다.
 */
class TwitterUser(nickname: String): User(nickname) {
    /**/
}

// 별도로 생성자를 지정하지 않으면 컴파일러가 인자가 없는 디폴트 생성자를 만들어준다.
open class Button3

/**
 * Button3의 생성자는 아무 인자도 받지 않지만,
 * 하위 클래스는 반드시 Button3 클래스의 생성자를 호출해야 한다.
 *
 * 이 규칙으로 인해 기반 클래스의 이름 뒤에는 꼭 괄호가 들어간다.
 * 반면 인터페이스는 생성자가 없기 때문에 괄호도 없다.
 */
class RadioButton: Button3()

// 클래스 외부에서 인스턴스화하지 못하게 막고 싶다면 생성자를 private으로 만들면된다.
class Secretive private constructor() {}



/**
 * 그래도 생성자가 여럿 필요한 경우가 가끔 있다.
 * 가장 일반적인 상황은 프레임워크 클래스를 확장해야 하는데
 * 여러가지 방법으로 인스턴스를 초기화할 수 있게 다양한 생성자를 지원해야 하는 경우다.
 */
class Context
open class AttributeSet
open class View2 { // 주 생성자가 없다.
    // 부 생성자들
    constructor(ctx: Context) {
        println("View2의 constructor(ctx)")
    }
    constructor(ctx: Context, attr: AttributeSet) {
        println("View2의 constructor(ctx, attr)")
    }
}

class MyButton: View2 {
    // 상위 클래스의 생정자를 호출한다.
    constructor(ctx: Context): super(ctx) {
        println("MyButton의 constructor(ctx)")
    }
    constructor(ctx: Context, attr: AttributeSet): super(ctx, attr) {
        println("MyButton의 constructor(ctx, attr)")
    }
}

class MY_STYLE: AttributeSet()
class MyButton2: View2 {
    // this()를 통해 클래스 자신의 다른 생성자를 호출할 수 있다.
    constructor(ctx: Context): this(ctx, MY_STYLE()) {
        println("MyButton2의 constructor(ctx)")
    }
    constructor(ctx: Context, attr: AttributeSet): super(ctx, attr) {
        println("MyButton2의 constructor(ctx, attr)")
    }
}

fun main() {
    val hyun = User2("현진")
    println(hyun.isSubscribed)

    val view2 = View2(Context())
    val myButton = MyButton(Context())
    val myButton2 = MyButton2(Context())

}