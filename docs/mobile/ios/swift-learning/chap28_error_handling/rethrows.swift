/*
    함수나 메서드는 rethrows 키워드를 사용하여 자신의 매개변수로 전달받은 함수가 오류를 던진다는 것을 나타낼 수 있다.
    다시 던지기(rethrowing)가 가능허려면 최소 하나 이상의 오류 발생 가능한 함수를 매개변수로 전달받아야한다.
*/

func someThrowingFunction() throws {
    enum SomeError: Error {
        case justSomeError
    }
    throw SomeError.justSomeError
}

func someFunction(callback: () throws -> Void) rethrows {
    try callback() // 다시 던지기 함수는 오류를 다시 전질 뿐 따로 처리하지는 않는다.
}

do {
    try someFunction(callback: someThrowingFunction)
} catch {
    print(error)
}

/*
    다시 던지기 함수 또는 메서드는 기본적으로 스스로 오류룰 던지지 못한다.
    즉, 자신의 내부에서 직접적으로 throw 구문을 사용할 수 없다.
    다만 do-catch 구문을 사용해 새로운 오류로 바꿔 던질 수 있다.    
*/

func catchThrowingFunction(callback: () throws -> Void) rethrows {
    enum AnotherError: Error {
        case justAnotherError
    }

    // do-catch 구문을 사용해 오류 제어하기
    do {
        try callback()
    } catch {
        throw AnotherError.justAnotherError
    }

    /*
    do {
        // 매개변수로 전달한 오류 던지기 함수가 아니므로 제어할 수 없다.
        try someThrowingFunction()
    } catch {
        throw AnotherError.justAnotherError
    }
    */

    // 단독으로 오류를 던질 수 없다.
    // throw AnotherError.justAnotherError
    
    // a function declared 'rethrows' may only throw if its parameter does

}

/*
    부모 클래스의 다시 던지기 메서드는 자식클래스에서 던지기 메서드로 재정의할 수 없다.
    그러나 부모 클래스의 던지기 메서드는 자식클래스에서 다시 던지기 메서드로 재정의할 수 있다.

    프로토콜 요구사항 중에 다시 던지기 메서드가 있다면, 던지기 메서드가 아닌 다시 던지기 메서드로 요구사항을
    충족해야 한다.
*/

// 후처리 defer
// defer 구문을 사용해 현재 코드 블록을 나가기 전에 꼭 실행해야 하는 코드를 작성할 수 있다.
// 오류처리 상황, 함수, 메서드, 반복문, 조건문 등 보통의 코드 블록 어디에서든 사용할 수 있다.
// defer 구문 내부에서는 break, return 등의 코드와 오류를 던지는 코드는 작서하면 안된다.
// 여러개의 defer 구문이 하나의 블록에 있다면 맨 마지막에 작성된 구문부터 역순으로 실행된다.
func deferExamFunction(shouldThrowError: Bool) throws -> Int {
    defer {
        print("first")
    }

    if shouldThrowError {
        enum SomeError: Error {
            case juseSomeError
        }
        throw SomeError.juseSomeError
    }

    defer {
        print("second")
    }
    defer {
        print("third")
    }
    return 100
}
try? deferExamFunction(shouldThrowError: true) // 오류를 던지기 이전까지 작성된 defer까지만 실행
try? deferExamFunction(shouldThrowError: false)

// do 구문을 catch를 제외하고 단독으로 사용할 수 있다.
// 하위 블록을 만들고자 할때인데, 하위 블록이 종료될 때 그 내부의 defer구문이 실행된다.