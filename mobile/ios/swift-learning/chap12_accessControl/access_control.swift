// 모듈과 소스파일
// 모듈은 배포할 코드의 묶음 단위
// import 키워드를 사용해 불러온다.
// 소스파일은 하나의 소스 코드 파일을 의미한다.
// 자바나 Objective-C 등은 통상 파일 하나에 타입을 하나만 정의한다.
// 스위프트도 보통 파일 하나에 타입 하나만 정의하지만, 소스파일 하나에 더 많은 것을 정의하거나 구현할 수도 있다.

/*
    접근수준
    클래스, 구조체, 열거형 등 각 타입과
    타입 내부의 프로퍼티, 메서드, 이니셜라이저, 서브스크립트 각각에도 접근수준을 지정할 수 있다.
    open            모듈 외부까지, 클래스에서만 사용
    public          모듈 외부까지
    internal        모듈 내부
    fileprivate     파일 내부
    private         기능 정의 내부

    public - 주로 프레임워크에서 외부와 연결된 인터페이스를 구현하는데 많이 쓰인다.
    
    open과 public 차이
    open을 제외하면 모든 접근수준의 클래스는 그 모듈 안에서만 상속할 수 있다.
    open을 제외하면 모든 접근수준의 클래스 멤버는 그 모듈 안에서만 재정의할 수 있다.
    즉, open은 다른 모듈에서도 부모클래스로 사용하겠다는 목적으로 작성되었음을 의미한다.

    internal - 기본적으로 모든 요소에 암묵적으로 지정하는 기본 접근수준
    다른 외부 모듈에서는 접근할 수 없다.
    
    fileprivate - 소스파일 내부에서만 접근 가능. 해당 소스파일 외부에서 값이 변경되거나 함수를 호출하면
    부작용이 생길 수 있는 경우 사용

    private - 그 기능을 정의하고 구현한 범위 내에서만 사용할 수 있다. 심지어 같은 소스파일 안이라도 다른 타입이라면 사용할 수 없다.

    접근제어 구현 참고사항
    ---
    상위 요소보다 하위요소가 더 높은 접근수준을 가질 수 없다.
    함수뿐만 아니라 튜플의 내부 요소 타입 또한 튜플의 접근수준보다 같거나 높아야한다.
*/
internal class InternalClass {}
private struct PrivateStruct {}

// public var publicTuple: (first: InternalClass, second: PrivateStruct) = (InternalClass(), PrivateStruct()) // variable cannot be declared public because its type uses a private type
private var privateTuple: (first: InternalClass, second: PrivateStruct) = (InternalClass(), PrivateStruct())

// 열거형의 접근수준을 구현할 때 열거형 내부의 각 case별로 따로 접근수준을 부여할 수 없다.
// 열거형의 원시값 타입으로 열거형의 접근수준보다 낮은 수준의 타입이 올 수는 없다.
private typealias PointValue = Int

// enum must be declared private or fileprivate because its raw type uses a private type
// enum Point: PointValue {
//     case x, y
// }

// private과 fileprivate
public struct SomeType {
    private var privateVar = 0
    fileprivate var fileprivateVar = 0
}

extension SomeType {
    public func publicMethod() {
        print("\(self.privateVar), \(self.fileprivateVar)")
    }

    private func privateMethod() {
        print("\(self.privateVar), \(self.fileprivateVar)")
    }

    fileprivate func fileprivateMethod() {
        print("\(self.privateVar), \(self.fileprivateVar)")
    }
}

struct AnotherType {
    var someInstance: SomeType = SomeType()

    mutating func someMethod() {
        self.someInstance.publicMethod()

        // 같은 파일에 속하므로 접근 가능
        self.someInstance.fileprivateVar = 100
        self.someInstance.fileprivateMethod()

        // 다른 타입 내부의 코드이므로 접근 불가!
        // self.someInstance.privateVar = 100
        // self.someInstance.privateMethod()
    }
}

var anotherInstance = AnotherType()
anotherInstance.someMethod()

// 읽기 전용 구현
// 생성자만 더 낮은 접근 수준을 갖도록 제한
public struct MyType {
    private var count: Int = 0
    public var publicStoredProp: Int = 0

    public private(set) var publicGetOnlyProp: Int = 0

    internal var internalComputeProp: Int {
        get {
            return count
        }
        set {
            count += 1
        }
    }

    internal private(set) var internalGetOnlyComputeProp: Int {
        get {
            return count
        }
        set {
            count += 1
        }
    }

    public subscript() -> Int {
        get {
            return count
        }
        set {
            count += 1
        }
    }

    public internal(set) subscript(some: Int) -> Int {
        get {
            return count
        }
        set {
            count += 1
        }
    }
}

var myInstance: MyType = MyType()

print("myInstance.publicStoredProp \(myInstance.publicStoredProp)")
myInstance.publicStoredProp = 100

print("myInstance.publicGetOnlyProp \(myInstance.publicGetOnlyProp)")
// myInstance.publicGetOnlyProp = 100 // 오류

print("myInstance.internalComputeProp \(myInstance.internalComputeProp)")
myInstance.internalComputeProp = 1000

print("myInstance.internalGetOnlyComputeProp \(myInstance.internalGetOnlyComputeProp)")
// myInstance.internalGetOnlyComputeProp = 2000 // 오류

// 서브스크립트 사용
print("myInstance[] \(myInstance[])")
myInstance[] = 100
print("myInstance[] \(myInstance[])")

print("myInstance[0] \(myInstance[0])")
myInstance[0] = 100
print("myInstance[0] \(myInstance[0])")
