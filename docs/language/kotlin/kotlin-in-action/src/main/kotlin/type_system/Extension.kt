package type_system

/**
 * 널이 될 수 있는 타입에 대한 확장 함수를 정의하면
 * null 값을 다루는 강력한 도구로 활용할 수 있다.
 *
 * 어떤 메소드를 호출하기 전에 수신 객체 역할을 하는 변수가 널이 될 수 없다고 보장하는 대신,
 * 직접 변수에 대해 메소드를 호출해도 확장 함수인 메소드가 알아서 널을 처리해준다.
 */
fun verifyUserInput(input: String?) {
    // 널이 될 수 있는 값.널이 될 수 있는 타입의 확장함수
    if (input.isNullOrBlank()) {
        println("Please fill in the required fields")
    }
}

/**
 * 널이 될 수 있는 타입의 확장함수에서 this는 null이 될 수 있다.
 */
fun String?.isNullOrBlank(): Boolean = this == null || this.isBlank()

/**
 * 직접 확장 함수를 작성한다면 그 확장 함수를 널이 될 수 있는 타입에 적용할지 여부를 고민할 필요가 있다.
 * 처음에는 널이 될 수 없는 타입에 확장 함수를 정의하라.
 * 나중에 대부분 널이 될 수 있는 타입에 대해 그 함수를 호출했다는 사실을 깨닫게 되면 그 때 바꿔라.
 * 확장 함수 안에서 널을 제대로 처리하게 되면 안전하게 그 확장 함수를 널이 될 수 있는 타입에 대한 확장 함수로 바꿀 수 있다.
 */