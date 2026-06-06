# Go (Golang) 백엔드 실습: 고성능 및 생산성을 위한 서버 설계

본 프로젝트는 **Go (Golang)** 언어의 핵심 철학인 단순함(Simplicity)과 효율성(Efficiency)을 바탕으로, 웹 서버 구축의 다양한 패턴(RESTful API, OAuth, Decorator Pattern 등)을 실습한 공간입니다.

---

## 🏗 프로젝트 구조 및 핵심 모듈

- **Todo App (`todoapp`):** SQLite와 Google OAuth2를 연동한 실전 웹 애플리케이션.
- **RESTful API (`restful`):** `gorilla/mux`를 활용한 표준 REST API 구현 및 TDD 실습.
- **Design Patterns:** Go의 인터페이스를 활용한 데코레이터 패턴 실습.
- **Advanced Features:** EventSource(Server-Sent Events), OAuth2, File Server 등.

---

## 🔑 핵심 구현 포인트

### 1. TDD (Test Driven Development) 기반의 API 개발
Go의 표준 라이브러리인 `net/http/httptest`와 `stretchr/testify`를 활용하여, 실제 서버를 띄우지 않고도 API의 동작을 완벽하게 검증합니다.

```go
// backend/go/go-backend/restful/app_test.go
func TestCreateUser(t *testing.T) {
    assert := assert.New(t)
    mock := httptest.NewServer(NewHandler()) // 테스트용 서버 생성
    defer mock.Close()

    res, err := http.Post(mock.URL+"/users", "application/json",
        strings.NewReader(`{"first_name":"hyunjin", "last_name":"kim"}`))

    assert.NoError(err)
    assert.Equal(http.StatusCreated, res.StatusCode)
}
```

### 2. 깔끔한 REST API 엔드포인트 설계
`gorilla/mux` 라우터를 사용하여 HTTP 메서드별 핸들러를 명확하게 분리하고, 정규표현식을 이용한 경로 변수 처리를 적용하였습니다.

```go
// backend/go/go-backend/restful/app.go
func NewHandler() http.Handler {
    mux := mux.NewRouter()
    mux.HandleFunc("/users", usersHandler).Methods("GET")
    mux.HandleFunc("/users", createUserHandler).Methods("POST")
    mux.HandleFunc("/users/{id:[0-9]+}", getUserInfoHandler).Methods("GET")
    return mux
}
```

### 3. 인터페이스와 데코레이터 패턴
Go는 명시적인 상속 대신 인터페이스를 통한 합성을 권장합니다. 이를 통해 기존 로직을 수정하지 않고 기능을 동적으로 추가하는 데코레이터 패턴을 실습하였습니다.

---

## 🛠 주요 도구 및 라이브러리
- **Go Standard Library (`net/http`):** 웹 서버 구축의 근간.
- **Gorilla Mux/Sessions:** 라우팅 및 세션 관리.
- **OAuth2:** Google 소셜 로그인 연동.
- **SQLite:** 가벼운 로컬 데이터베이스 연동.

---

## 📈 학습 포인트
- **Goroutines & Channels:** Go의 동시성 모델을 이해하고 효율적인 자원 사용법 습득.
- **Interface-based Design:** 의존성 주입(DI)과 유연한 코드 작성을 위한 인터페이스 활용.
- **Error Handling:** Go 특유의 명시적인 에러 처리 방식을 통한 안정적인 시스템 설계.

---
*본 프로젝트는 Go 언어를 활용하여 작지만 강력하고 유지보수가 용이한 백엔드 시스템을 구축하는 방법을 익히기 위해 제작되었습니다.*
