// Package main은 애플리케이션의 진입점입니다.
// 이 패키지는 Todo 애플리케이션을 초기화하고 실행합니다.
package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/sessions" // 세션 관리를 위한 패키지
	"github.com/joho/godotenv"    // 환경 변수 로드를 위한 패키지
	"golang.org/x/oauth2"         // OAuth2 인증을 위한 패키지
	"golang.org/x/oauth2/google"  // Google OAuth2 엔드포인트를 위한 패키지

	todoapp "github.com/kim-hyunjin/go-web/todoapp" // Todo 애플리케이션 패키지
)

// main 함수는 애플리케이션의 진입점입니다.
// 환경 변수를 로드하고, OAuth 설정을 구성하며, 세션 스토어를 초기화하고,
// Todo 애플리케이션 핸들러를 생성한 후 HTTP 서버를 시작합니다.
func main() {
	// .env 파일에서 환경 변수 로드
	err := godotenv.Load("./.env")
	if err != nil {
		panic(err) // 환경 변수 로드 실패 시 애플리케이션 종료
	}
	
	// Google OAuth 설정 구성
	todoapp.GoogleOauthConfig = oauth2.Config{
		RedirectURL: "http://localhost:3000/auth/google/callback", // 인증 후 리디렉션 URL
		ClientID: os.Getenv("client_id"),                          // 환경 변수에서 클라이언트 ID 가져오기
		ClientSecret: os.Getenv("client_secret"),                  // 환경 변수에서 클라이언트 시크릿 가져오기
		Scopes: []string{"https://www.googleapis.com/auth/userinfo.email"}, // 이메일 정보 접근 권한 요청
		Endpoint: google.Endpoint,                                 // Google OAuth 엔드포인트 사용
	}
	
	// 세션 스토어 초기화
	todoapp.Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

	// Todo 애플리케이션 핸들러 생성 (SQLite 데이터베이스 사용)
	app := todoapp.MakeHandler("./test.db")
	defer app.Close() // 애플리케이션 종료 시 데이터베이스 연결 닫기
	
	// 애플리케이션 시작 메시지 출력
	fmt.Println("App Started!")
	
	// 3000번 포트에서 HTTP 서버 시작
	http.ListenAndServe(":3000", app)
}