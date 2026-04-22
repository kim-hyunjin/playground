# 현대 프로그래밍 언어 지도: Go, Kotlin, Rust, Java 비교 분석

본 프로젝트는 현대 백엔드 및 시스템 엔지니어링에서 가장 널리 쓰이는 언어들의 핵심 문법과 설계 철학을 깊이 있게 학습한 공간입니다. 각 언어가 해결하고자 하는 문제와 그 방식을 코드를 통해 비교합니다.

---

## 🐹 1. Go (Golang): 단순함과 동시성의 미학

Google이 만든 Go는 단순한 문법과 강력한 **고루틴(Goroutine)**을 통한 동시성 처리가 특징입니다.

### 고루틴과 채널 (Concurrency)
공유 메모리가 아닌 "통신"을 통해 데이터를 주고받는 철학을 실천합니다.

```go
// language/go/tucker/channel/main.go
func main() {
    ch := make(chan int) // 채널 생성
    go func() {
        ch <- 100 // 고루틴에서 데이터 송신
    }()
    fmt.Println(<-ch) // 데이터 수신 (Blocking)
}
```

---

## 🏖️ 2. Kotlin: Java를 넘어선 실무형 언어

Kotlin은 Java와 100% 호환되면서도, **Null Safety**와 **간결한 문법**을 통해 개발자의 실수를 줄이고 생산성을 높입니다.

### Null Safety & Extension Functions
```kotlin
// language/kotlin/kotlin-in-action/src/main/kotlin/type_system/Nullable.kt
fun printLength(str: String?) {
    // 세이프 콜(?.)을 통해 NullPointerException 방지
    println(str?.length ?: 0) 
}

// 확장 함수를 통한 기존 클래스 기능 추가
fun String.lastChar(): Char = this[this.length - 1]
```

---

## 🦀 3. Rust: 안전성과 성능의 완벽한 조화

Rust는 가비지 컬렉터 없이도 **소유권(Ownership)** 개념을 통해 메모리 안전성을 보장하며, C++에 버금가는 성능을 냅니다.

### 소유권 시스템 (Ownership)
```rust
// language/rust/main.rs
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1의 소유권이 s2로 이동 (Move)
    // println!("{}", s1); // 컴파일 에러 발생! 메모리 해제 오류 원천 차단
}
```

---

## ☕ 4. Java: 견고한 생태계와 객체지향의 정석

Java는 오랜 시간 동안 엔터프라이즈 환경에서 검증된 언어로, 강력한 객체지향 원칙과 방대한 라이브러리 생태계를 자랑합니다.

### 학습 노트 (Java Deep Dive)
- **JVM 구조:** 클래스 로딩부터 가비지 컬렉션까지의 원리 학습.
- **Generic & Reflection:** 유연한 프레임워크 설계를 위한 고급 기술 실습.
- **Multithreading:** 안정적인 동시성 제어를 위한 동기화 기법 정리.

---

## 📊 언어별 한 줄 요약 및 선택 가이드

| 언어 | 핵심 가치 | 추천 용도 |
| :--- | :--- | :--- |
| **Go** | 단순함, 동시성 | 마이크로서비스(MSA), 클라우드 네이티브 도구 |
| **Kotlin** | 생산성, 안전성 | 안드로이드 앱, 현대적인 Spring Boot 백엔드 |
| **Rust** | 안전성, 성능 | 시스템 프로그래밍, 브라우저 엔진, 블록체인 |
| **Java** | 견고함, 생태계 | 대규모 엔터프라이즈 시스템, 금융 솔루션 |

---
*본 저장소는 언어의 문법을 넘어 그 이면의 설계 철학을 이해하고자 하는 노력을 담고 있습니다.*
