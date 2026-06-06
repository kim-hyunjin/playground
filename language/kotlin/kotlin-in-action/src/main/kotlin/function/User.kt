package function

import java.lang.IllegalArgumentException

class User(val id: Int, val name: String, val address: String)

fun saveUser(user: User) {
    // 필드 검증이 중복된다.
    if (user.name.isEmpty()) {
        throw IllegalArgumentException("Can't save user ${user.id}: empty Name")
    }

    if (user.address.isEmpty()) {
        throw IllegalArgumentException("Can't save user ${user.id}: empty Address")
    }
}

fun saveUser2(user: User) {
    // 검증 코드를 로컬 함수로 분리
    fun validate(user: User, value: String, fieldName: String) {
        if (value.isEmpty()) {
            throw IllegalArgumentException("Can't save user ${user.id}: empty $fieldName")
        }
    }
    validate(user, user.name, "Name")
    validate(user, user.address, "Address")

    // user를 데이터베이스에 저장
}

fun saveUser3(user: User) {
    fun validate(value: String, fieldName: String) {
        if (value.isEmpty()) {
            // 로컬 함수는 자신이 속한 바깥 함수의 모든 파라미터와 변수를 사용할 수 있다.
            throw IllegalArgumentException("Can't save user ${user.id}: empty $fieldName")
        }
    }
    validate(user.name, "Name")
    validate(user.address, "Address")

    // user를 데이터베이스에 저장
}

// 더 개선하자면 검증 로직을 User 클래스를 확장한 함수로 만들 수도 있다.
fun User.validateBeforeSave() {
    fun validate(value: String, fieldName: String) {
        if (value.isEmpty()) {
            throw IllegalArgumentException("Can't save user ${id}: empty $fieldName")
        }
    }
    validate(name, "Name")
    validate(address, "Address")
}

fun saveUser4(user: User) {
    user.validateBeforeSave()

    // user를 데이터베이스에 저장
}

/*
* 코드를 확장 함수로 뽑아내는 기법은 놀랄 만큼 유용하다.
* 위의 경우 User를 간결하게 유지해 생각해야할 내용이 줄어들어서 더 쉽게 코드를 파악할 수 있다.
* 한 객체를 다루면서 객체의 비공개 데이터를 다룰 필요는 없는 함수는 확장함수로 만들면
* 객체.멤버 처럼 수신객체를 지정하지 않고도 공개된 프로퍼티나 메서드에 접근할 수 있다.
*
* 확장함수를 로컬함수로 정의할 수도 있다.
* 즉 User.validateBeforeSave()를 saveUser() 내부에 로컬 함수로 넣을 수 있다.
* 하지만 중첩된 함수의 깊이가 깊어지면 코드를 읽기가 상당히 어려워진다.
* 따라서 일반적으로는 한 단계까지만 중첩시키자.
*
* */