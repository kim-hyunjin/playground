// Package myapp은 간단한 HTTP 서버를 구현합니다.
// 이 패키지는 다양한 HTTP 핸들러와 라우팅을 보여주는 예제입니다.
package myapp

import (
	"encoding/json" // JSON 인코딩/디코딩을 위한 패키지
	"fmt"
	"net/http"      // HTTP 서버 및 클라이언트를 위한 패키지
	"time"          // 시간 관련 기능을 위한 패키지
)

// User 구조체는 사용자 정보를 나타냅니다.
type User struct {
	FirstName string    `json:"first_name"` // 사용자 이름
	LastName string     `json:"last_name"`  // 사용자 성
	Email string        `json:"email"`      // 이메일 주소
	CreatedAt time.Time `json:"created_at"` // 생성 시간
}

// fooHandler 구조체는 /foo 경로의 요청을 처리하는 핸들러입니다.
type fooHandler struct{}

// ServeHTTP는 fooHandler의 HTTP 요청 처리 메서드입니다.
// JSON 형식의 사용자 정보를 받아 처리하고 응답합니다.
func (f *fooHandler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	// 요청 본문에서 사용자 정보 파싱
	user := new(User)
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		// JSON 파싱 실패 시 400 Bad Request 응답
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, "Bad Request: ", err)
		return
	}
	
	// 생성 시간 설정
	user.CreatedAt = time.Now()

	// 사용자 정보를 JSON으로 변환
	data, _ := json.Marshal(user)
	
	// 응답 헤더 및 상태 코드 설정
	rw.Header().Add("content-type", "application/json")
	rw.WriteHeader(http.StatusCreated)
	
	// JSON 응답 반환
	fmt.Fprint(rw, string(data))
}

// indexHandler는 루트 경로(/)의 요청을 처리하는 핸들러 함수입니다.
// "hello world" 메시지를 응답으로 반환합니다.
func indexHandler (rw http.ResponseWriter, r *http.Request) {
	fmt.Fprint(rw, "hello world")
}

// barHandler는 /bar 경로의 요청을 처리하는 핸들러 함수입니다.
// URL 쿼리 파라미터에서 name을 가져와 인사말을 응답으로 반환합니다.
func barHandler (rw http.ResponseWriter, r *http.Request) {
	// URL 쿼리에서 name 파라미터 가져오기
	name := r.URL.Query().Get("name")
	
	// name이 없으면 기본값 "world" 사용
	if name == "" {
		name = "world"
	}
	
	// 인사말 응답 반환
	fmt.Fprintf(rw, "hello, %s!", name)
}

// NewHttpHandler는 HTTP 핸들러를 생성하고 라우팅을 설정합니다.
// 각 경로에 해당하는 핸들러를 등록하고 ServeMux를 반환합니다.
func NewHttpHandler() http.Handler {
	// 기본 HTTP 핸들러(ServeMux) 생성
	mux := http.NewServeMux()
	
	// 서버 시작 메시지 출력
	fmt.Println("Server Started!")
	
	// 경로별 핸들러 등록
	mux.HandleFunc("/", indexHandler)     // 루트 경로
	mux.HandleFunc("/bar", barHandler)    // /bar 경로
	mux.Handle("/foo", &fooHandler{})     // /foo 경로 (구조체 핸들러)

	return mux
}