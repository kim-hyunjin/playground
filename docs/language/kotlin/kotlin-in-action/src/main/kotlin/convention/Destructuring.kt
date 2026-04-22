package convention

/**
 * 내부에서 구조 분해 선언은 componentN 이라는 함수를 호출한다.
 * data 클래스의 주 생성자에 들어있는 프로퍼티에 대해서는 컴파일러가 자동으로 componentN 함수를 만들어준다.
 *
 * 코틀린 표쥰 라이브러리에서는 맨 앞의 다섯 원소에 대한 componentN을 제공한다.
 */
class PointComponentNExam(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}

data class NameComponents(val name: String, val extension: String)

fun splitFilename(fullName: String): NameComponents {
    val (name, ext) = fullName.split(".", limit = 2)
    return NameComponents(name, ext)
}

fun printEntries(map: Map<String, String>) {
    // 루프 변수에 구조 분해 선언
    for ((key, value) in map) {
        println("$key -> $value")
    }
}

fun main() {
    val p = Point(10, 20)
    val (x, y) = p
    println(x)
    println(y)

    val (name, ext) = splitFilename("exam.kt")
    println(name)

    val map = mapOf("Oracle" to "Java", "Jetbrains" to "Kotlin")
    printEntries(map)
}