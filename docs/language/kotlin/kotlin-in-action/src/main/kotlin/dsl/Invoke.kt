package dsl

/**
 * invoke 관례 : 함수처럼 호출할 수 있는 객체
 */
class Greeter(val greeting: String) {
    operator fun invoke(name: String) {
        println("$greeting, $name!")
    }
}

/**
 * invoke 관례와 함수형 타입
 */
data class Issue(
    val id: String, val project: String, val type: String,
    val priority: String, val description: String
)

class ImportantIssuesPredicate(private val project: String) : (Issue) -> Boolean { // 함수 타입을 상속
    override fun invoke(p1: Issue): Boolean {
        return p1.project == project && p1.isImportant()
    }

    private fun Issue.isImportant(): Boolean {
        return type == "Bug" && (priority == "Major" || priority == "Critical")
    }
}

fun main() {
    val bavarianGreeter = Greeter("Servus")
    bavarianGreeter("Dmitry") // Greeter 인스턴스를 함수처럼 호출 내부적으로 bavarianGreeter.invoke("Dmitry")로 컴파일된다.

    val issue1 = Issue("이슈1", "IDEA", "Bug", "Major", "중요한 기능 버그")
    val issue2 = Issue("이슈2", "IDEA", "Feature", "Normal", "보통 중요도 기능 이슈")
    val predicate = ImportantIssuesPredicate("IDEA")
    for (issue in listOf(issue1, issue2).filter(predicate)) { // 람다를 함수 타입 인터페이스를 구현하는 클래스로 변환해서 사용(람다 내 기능 분리 가능)
        println(issue)
    }
}