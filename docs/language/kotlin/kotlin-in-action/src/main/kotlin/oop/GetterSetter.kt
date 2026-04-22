package oop

class User5(val name: String) {
    /*
    * 접근자의 본문에서 field라는 특별한 식별자를 통해 뒷밤침하는 필드에 접근할 수 있다.
    * 게터에서는 field값을 읽을 수만 있고, 세터에서는 field값을 읽거나 쓸 수 있다.
    * */
    var address: String = "unspecified"
        set(value: String) {
            println("""
                Address was changed for $name:
                "$field" -> "$value"
            """.trimIndent())
            field = value
        }
}

fun main() {
    val user = User5("Alice")
    /*
    * 코틀린에서 프로퍼티의 값을 바꿀 때는 아래와 같이 필드 설정 구문을 사용한다.
    * 내부적으로는 address의 세터를 호출한다.
    * 이 예제에서는 커스텀 세터를 정의해서 추가 로직을 실행한다.
    * */
    user.address = "서울시 관악구"
}