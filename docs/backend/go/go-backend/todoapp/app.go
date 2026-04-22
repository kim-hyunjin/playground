// Package todoapp는 Todo 애플리케이션의 핵심 기능을 구현합니다.
// 이 패키지는 HTTP 핸들러, 라우팅, 인증 체크 등을 담당합니다.
package todoapp

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"      // URL 라우팅을 위한 패키지
	"github.com/gorilla/sessions" // 세션 관리를 위한 패키지
	"github.com/kim-hyunjin/go-web/todoapp/model" // Todo 모델 패키지
	"github.com/unrolled/render"  // JSON, HTML 렌더링을 위한 패키지
	"github.com/urfave/negroni"   // HTTP 미들웨어를 위한 패키지
)

// Store는 세션 정보를 저장하는 쿠키 스토어입니다.
var Store *sessions.CookieStore
// rd는 JSON 응답을 렌더링하기 위한 렌더러입니다.
var rd *render.Render = render.New()

// Success 구조체는 작업 성공 여부를 나타내는 응답 구조체입니다.
type Success struct {
	Success bool `json:"success"` // 작업 성공 여부
}

// AppHandler 구조체는 애플리케이션의 HTTP 핸들러와 데이터베이스 핸들러를 포함합니다.
type AppHandler struct {
	http.Handler // http.Handler를 embed하여 ServeHTTP 메서드를 상속받습니다.
	db model.DbHandler // 데이터베이스 작업을 위한 핸들러
}

// getSessionId는 HTTP 요청에서 세션 ID를 추출하는 함수입니다.
var getSessionId = func (r *http.Request) string {
	// 세션 스토어에서 세션 가져오기
	session, err := Store.Get(r, "session")
	if err != nil {
		return "" // 세션 가져오기 실패 시 빈 문자열 반환
	}

	// 세션에서 ID 값 추출
	val := session.Values["id"]
	if val == nil {
		return "" // ID 값이 없으면 빈 문자열 반환
	}
	return val.(string) // ID 값을 문자열로 변환하여 반환
}

// indexHandler는 루트 경로 요청을 처리하는 핸들러입니다.
// todo.html 페이지로 리디렉션합니다.
func (a *AppHandler) indexHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/todo.html", http.StatusTemporaryRedirect)
}

// getTodosHandler는 사용자의 모든 Todo 항목을 가져오는 핸들러입니다.
func (a *AppHandler) getTodosHandler(w http.ResponseWriter, r *http.Request) {
	sessionId := getSessionId(r) // 세션 ID 가져오기
	list := a.db.GetTodos(sessionId) // 해당 세션의 Todo 목록 가져오기
	rd.JSON(w, http.StatusOK, list) // JSON 형식으로 응답
}

// addTodoHandler는 새로운 Todo 항목을 추가하는 핸들러입니다.
func (a *AppHandler) addTodoHandler(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name") // 폼에서 Todo 이름 가져오기
	sessionId := getSessionId(r) // 세션 ID 가져오기
	todo := a.db.AddTodo(name, sessionId) // 새 Todo 추가
	rd.JSON(w, http.StatusCreated, todo) // 생성된 Todo를 JSON 형식으로 응답
}

// deleteTodoHandler는 특정 ID의 Todo 항목을 삭제하는 핸들러입니다.
func (a *AppHandler) deleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) // URL 변수 추출
	id, _ := strconv.Atoi(vars["id"]) // ID를 정수로 변환
	ok := a.db.DeleteTodo(id) // Todo 삭제
	if ok {
		rd.JSON(w, http.StatusOK, Success{true}) // 성공 시 true 응답
	} else {
		rd.JSON(w, http.StatusOK, Success{false}) // 실패 시 false 응답
	}	
}

// completeTodoHandler는 Todo 항목의 완료 상태를 변경하는 핸들러입니다.
func (a *AppHandler) completeTodoHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) // URL 변수 추출
	id, _ := strconv.Atoi(vars["id"]) // ID를 정수로 변환
	complete := r.FormValue("complete") == "true" // 완료 상태 값 가져오기
	ok := a.db.CompleteTodo(id, complete) // Todo 완료 상태 변경
	if ok {
		rd.JSON(w, http.StatusOK, Success{true}) // 성공 시 true 응답
	} else {
		rd.JSON(w, http.StatusOK, Success{false}) // 실패 시 false 응답
	}
}

// Close는 애플리케이션 종료 시 데이터베이스 연결을 닫는 메서드입니다.
func (a *AppHandler) Close() {
	a.db.Close()
}

// CheckSignin은 사용자 인증 상태를 확인하는 미들웨어 함수입니다.
// 인증되지 않은 사용자는 로그인 페이지로 리디렉션합니다.
func CheckSignin(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	// 로그인 또는 인증 관련 경로는 인증 체크 없이 통과
	if strings.Contains(r.URL.Path, "/signin") || strings.Contains(r.URL.Path, "/auth") {
		next(rw, r)
		return
	}

	// 이미 로그인한 사용자는 통과
	sessionId := getSessionId(r)
	if sessionId != "" {
		next(rw, r)
		return
	}

	// 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
	http.Redirect(rw, r, "/signin.html", http.StatusTemporaryRedirect)
}

// MakeHandler는 애플리케이션의 HTTP 핸들러를 생성하는 함수입니다.
// 라우팅 설정, 미들웨어 설정, 데이터베이스 연결 등을 수행합니다.
func MakeHandler(filepath string) *AppHandler {
	// 라우터 생성
	mux := mux.NewRouter()

	// Negroni 미들웨어 설정
	// - 복구(panic 발생 시 처리)
	// - 로깅
	// - 인증 체크
	// - 정적 파일 서빙
	n := negroni.New(negroni.NewRecovery(), negroni.NewLogger(), negroni.HandlerFunc(CheckSignin), negroni.NewStatic(http.Dir("public")))
	n.UseHandler(mux)

	// AppHandler 생성
	a := &AppHandler{
		Handler: n, // Negroni 미들웨어를 핸들러로 사용
		db: model.NewDbHandler(filepath), // 데이터베이스 핸들러 생성
	}
	
	// 라우트 설정
	mux.HandleFunc("/", a.indexHandler) // 루트 경로
	mux.HandleFunc("/todos", a.getTodosHandler).Methods("GET") // Todo 목록 조회
	mux.HandleFunc("/todos", a.addTodoHandler).Methods("POST") // Todo 추가
	mux.HandleFunc("/todos/{id:[0-9]+}", a.deleteTodoHandler).Methods("DELETE") // Todo 삭제
	mux.HandleFunc("/complete-todo/{id:[0-9]+}", a.completeTodoHandler).Methods("GET") // Todo 완료 상태 변경
	mux.HandleFunc("/auth/google/login", googleLoginHandler) // Google 로그인
	mux.HandleFunc("/auth/google/callback", googleOAuthCallbackHandler) // Google OAuth 콜백

	return a
}