package oop

/**
 * 대규모 객체지향 시스템을 설계할 때 시스템을 취약하게 만드는 문제는 보통 구현 상속에 의해 발생한다.
 * 하위 클래스가 상위 클래스의 메소드 중 일부를 오버라이드 하면 하위클래스는 상위 클래스의 세부 구현 사항에 의존하게 된다.
 * 시스템이 변함에 따라 상위 클래스의 구현이 바뀌거나 상위 클래스에 새로운 메서드가 추가된다.
 * 그 과정에서 하위 클래스가 상위 클래스에 갖고 있던 가정이 깨져서 코드가 정상적으로 동작하지 못하는 경우가 생길 수 있다.
 *
 * 코틀린은 이런 문제를 인식하고 기본적으로 클래스를 final로 취급한다.
 * 상속을 염두에 둔 경우 open 변경자로 열어두어야 한다.
 *
 * 하지만 종종 상속을 허용하지 않는 클래스에 새로운 동작을 추가해야 할 때가 있다.
 * 이럴 때 사용하는 일반적인 방법이 데코레이터 패턴이다.
 * 이런 접근 방법의 단점은 아래와 같이 준비 코드가 상당히 많이 필요하다는 점이다.
 */
class DelegatingCollection<T> : Collection<T> {
    private val innerList = arrayListOf<T>()

    override val size: Int get() = innerList.size
    override fun isEmpty(): Boolean = innerList.isEmpty()
    override fun contains(element: T): Boolean = innerList.contains(element)
    override fun iterator(): Iterator<T> = innerList.iterator()
    override fun containsAll(elements: Collection<T>): Boolean = innerList.containsAll(elements)

}

/**
 * 인터페이스를 구현할 때 by 키워드를 통해 그 인터페이스에 대한 구현을 다른 객체에 위임 중이라는 사실을 명시할 수 있다.
 * 위의 예제를 위임을 사용해 재작성하면 아래와 같다.
 * 클래스 안에 있던 모든 메소드 정의가 없어졌는데 컴파일러가 그런 전달 메소드를 자동으로 생성해준다.
 * 메소드 중 일부의 동작을 변경하고 싶은 경우 메소드를 오버라이드 하면 된다.
 *
 */
class DelegatingCollection2<T>(innerList: Collection<T> = ArrayList<T>()) : Collection<T> by innerList {}

class CountingSet<T>(
    val innerSet: MutableCollection<T> = HashSet<T>()
) : MutableCollection<T> by innerSet {
    var objectAdded = 0

    override fun add(element: T): Boolean {
        objectAdded++
        return innerSet.add(element)
    }

    override fun addAll(elements: Collection<T>): Boolean {
        objectAdded += elements.size
        return innerSet.addAll(elements)
    }
}

fun main() {
    val countingSet = CountingSet<Int>()
    countingSet.addAll(listOf(1, 1, 2))
    println("${countingSet.objectAdded} objects were added. ${countingSet.size} remain")
}