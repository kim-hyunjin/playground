package lambda

/**
 * 자바 메소드 안에서 무명 내부 클래스를 정의할 때 메소드의 로컬 변수를 무명 내부 클래스에서 사용할 수 있다.
 * 람다 안에서도 같은 일을 할 수 있다.
 * 람다를 함수 안에서 정의하면 함수의 파라미터 뿐 아니라 람다 정의의 앞에 선언된 로컬 변수까지 람다에서 모두 사용할 수 있다.
 */
fun main() {
    fun printMessagesWithPrefix(messages: Collection<String>, prefix: String) {
        // forEach는 일반적인 for 루프보다 훨씬 간결하지만 그렇다고 다른 장점이 많지는 않다. 따라서 기존 for 루프를 forEach로 모두 바꿀 필요는 없다.
        messages.forEach {
            println("$prefix $it")
        }
    }
    val errors = listOf("403 Forbidden", "404 Not Found", "500 Internal Server Error")
    printMessagesWithPrefix(errors, "Error:")

    // 자바와 다른점은 파이널 변수가 아닌 변수에 접근할 수 있다는 점이다.
    // 또한 람다 안에서 바깥의 변수를 변경해도 된다.
    fun printProblemCounts(responses: Collection<String>) {
        var clientErrors = 0
        var serverErrors = 0
        responses.forEach {
            if (it.startsWith("4")) {
                clientErrors++
            } else if (it.startsWith("5")) {
                serverErrors++
            }
        }

        println("$clientErrors client errors, $serverErrors server errors")
    }
    printProblemCounts(errors)

    /**
     * 위 예제의 prefix, clientErrors, serverErrors와 같이
     * 람다 안에서 사용하는 변수를 '람다가 포획(capture)한 변수'라고 부른다.
     * 람다를 실행 시점에 표현하는 데이터 구조는
     * 람다에서 시작하는 모든 참조가 포함된 닫힌(closed) 객체 그래프를 람다 코드와 함께 저장해야 한다.
     * 그런 데이터 구조를 클로저(closure)라고 부른다.
     *
     * 함수를 쓸모 있는 1급 시민으로 만들려면 포획한 함수를 제대로 처리해야 하고,
     * 포획한 변수를 제대로 처리하려면 클로저가 꼭 필요하다.
     * 그래서 람다를 클로저 라고 부르기도 한다.
     *
     * 기본적으로 함수 안에 정의된 로컬 변수의 생명주기는 함수가 반환되면 끝난다.
     * 하지만 어떤 함수가 자신의 로컬 변수를 포획한 람다를 반환하거나 다른 변수에 저장한다면
     * 로컬 변수의 생명주기와 함수의 생명주기가 달라질 수 있다.
     * 포획한 변수가 있는 람다를 저장해서 함수가 끝난 뒤에 실행해도
     * 람다의 본문 코드는 여전히 포획한 변수를 읽거나 쓸 수 있다.
     * 어떻게 그런 동작이 가능할까?
     * 파이널 변수를 포획한 경우에는 람다 코드를 변수 값과 함께 저장한다.
     * 파이널이 아닌 변수를 포획한 경우에는 변수를 특별한 래퍼로 감싸서 나중에 변경하거나 읽을 수 있게 한 다음,
     * 래퍼에 대한 참조를 람다 코드와 함께 저장한다.
     */
    class Ref<T>(var value: T)
    val counter = Ref(0)
    val inc = { counter.value++ } // 공식적으로는 변경 불가능한 변수를 포획했지만 그 변수가 가리키는 객체의 필드 값을 바꿀 수 있다.

    var counter2 = 0
    val inc2 = { counter2++ }
    /*
    * 람다가 파이널 변수(val)을 포획하면 자바와 마찬가지로 그 변수의 값이 복사된다.
    * 하지만 람다가 변경 가능한 변수(var)를 포획하면 변수를 Ref 클래스 인스턴스에 넣는다.
    * 그 Ref 인스턴스에 대한 참조를 파이널로 만들면 쉽게 람다로 포획할 수 있고,
    * 람다 안에서는 Ref 인스턴스의 필드를 변경할 수 있다.
    * */
}