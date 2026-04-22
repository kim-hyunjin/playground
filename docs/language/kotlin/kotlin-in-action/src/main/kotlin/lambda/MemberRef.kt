package lambda

/**
 * :: 을 사용하는 식을 멤버 참조라고 부른다.
 * 멤버 참조는 프로퍼티나 메소드를 단 하나만 호출하는 함수 값을 만들어준다.
 * ::는 클래스 이름과 참조하려는 멤버(프로퍼티나 메소드) 이름 사이에 위치한다.
 *
 * ex) Person::age
 *
 * 최상위에 선언된 함수나 프로퍼티를 참조할 수도 있다.
 * 클래스 이름을 생략하고 ::로 바로 시작한다.
 */
fun salute() = println("Salute!")
fun main() {
    run(::salute)

    // 생성자 참조를 사용하면 클래스 생성 작업을 연기하거나 저장해둘 수 있다. :: 뒤에 클래스 이름을 넣으면 생성자 참조를 만들 수 있다.
    data class Person(val name: String, val age: Int)
    val createPerson = ::Person
    val p = createPerson("Alice", 29)
    println(p)

    // 확장 함수도 똑같은 방식으로 참조할 수 있다.
    fun Person.isAdult() = age >= 21
    val predicate = Person::isAdult

    val personsAgeFunction = Person::age
    println(personsAgeFunction(p)) // 인스턴스 객체를 제공

    val dmitrysAgeFunction = p::age // 바운드 멤버 참조 - 멤버 참조를 생성할 때 인스턴스를 함께 저장
    println(dmitrysAgeFunction()) // 수신 대상 객체를 별도로 지정해 줄 필요가 없다.
}