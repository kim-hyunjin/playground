package lambda.collection

/**
 * flatMap 함수는 먼저 인자로 주어진 람다를 컬렉션의 모든 객체에 적용하고(또는 매핑하기)
 * 람다를 적용한 결과 얻어지는 여러 리스트를 한 리스트로 한데 모은다(flatten)
 */

class Book(val title: String, val authors: List<String>)

fun main() {
    val strings = listOf("abc", "def")
    // toList 함수를 문자열에 적용하면 문자열에 속한 모든 문자로 이루어진 리스트가 만들어진다.
    println(strings.flatMap { it.toList() }) // ["a", "b", "c"]와 ["d", "e", "f"]를 한 리스트로 합침

    val books = listOf(
        Book("Thursday Next", listOf("Jasper Fforde")),
        Book("Mort", listOf("Terry Pratchett")),
        Book("Good Omens", listOf("Terry Pratchett", "Neil Gaiman"))
    )
    println(books.flatMap { it.authors }.toSet()) // books의 작사를 한 리스트로 모은 후 set으로 만들어 중복을 제거

    // 리스트의 리스트가 있을 때 중첩된 리스트의 원소를 한 리스트로 모을 경우,
    // 특별히 변환해야 할 내용이 없다면 flatten 함수를 사용할 수 있다.
}