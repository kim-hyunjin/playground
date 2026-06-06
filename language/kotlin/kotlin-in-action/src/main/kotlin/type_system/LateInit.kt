package type_system

import org.junit.Assert
import org.junit.Before
import org.junit.Test

/**
 * 객체 인스턴스를 일단 생성한 다음에 나중에 초기화하는 프레임워크가 많다.
 * 하지만 코틀린에서 클래스 안의 프로퍼티는 생성자 안에서 초기화해야만 한다.
 * 널이 될 수 없는 타입이라면 반드시 널이 아닌 값으로 그 프로퍼티를 초기화해야 하는데
 * 그런 초기값을 제공할 수 없다면 널이 될 수 있는 타입을 사용할 수밖에 없다.
 * 그러면 모든 프로퍼티 접근에 널 검사를 넣거나 !! 연산자를 써야 해서 코드가 못생겨진다.
 *
 * 이를 해결하기 위해 late-initialized 할 수 있다.
 * lateinit 변경자를 붙이면 된다.
 *
 * lateinit 프로퍼티를 의존관계 주입(DI) 프레임워크와 함께 사용하는 경우가 많다.
 * 그런 시나리오에서는 lateinit 프로퍼티의 값을 DI 프레임워크가 외부에서 설정해준다.
 * 다양한 자바 프레임워크와의 호환성을 위해 코틀린은 lateinit이 지정된 프로퍼티와 가시성이 똑같은 필드를 생성해준다.
 */
class MyService {
    fun performAction(): String = "foo"
}

class MyTest {
    private lateinit var myService: MyService // 나중에 초기화하는 프로퍼티는 항상 var여야 한다.
    @Before
    fun setUp() {
        myService = MyService()
    }

    @Test
    fun testAction() {
        Assert.assertEquals("foo", myService.performAction())
    }
}