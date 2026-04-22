// Package todoapp의 signin.go 파일은 Google OAuth를 이용한 사용자 인증 기능을 구현합니다.
package todoapp

import (
	"context"
	"crypto/rand"       // 랜덤 데이터 생성을 위한 패키지
	"encoding/base64"   // base64 인코딩을 위한 패키지
	"encoding/json"     // JSON 처리를 위한 패키지
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/sessions" // 세션 관리를 위한 패키지
	"golang.org/x/oauth2"         // OAuth2 인증을 위한 패키지
)

// GoogleUserId 구조체는 Google API에서 반환하는 사용자 정보를 담는 구조체입니다.
type GoogleUserId struct {
	ID string `json:"id"`                 // Google 사용자 ID
	Email string `json:"email"`           // 사용자 이메일
	VerifiedEmail bool `json:"verified_email"` // 이메일 인증 여부
	Picture string `json:"picture"`       // 프로필 사진 URL
}

// GoogleOauthConfig는 Google OAuth 설정을 담는 변수입니다.
// main.go에서 초기화됩니다.
var GoogleOauthConfig oauth2.Config

// googleLoginHandler는 Google 로그인 요청을 처리하는 핸들러입니다.
// 상태 토큰을 생성하고 Google OAuth 인증 페이지로 리디렉션합니다.
func googleLoginHandler(w http.ResponseWriter, r *http.Request) {
	state := generateStateOauthCookie(w) // 상태 토큰 생성 및 쿠키 설정
	url := GoogleOauthConfig.AuthCodeURL(state) // Google OAuth URL 생성
	http.Redirect(w, r, url, http.StatusTemporaryRedirect) // Google 로그인 페이지로 리디렉션
}

// generateStateOauthCookie는 CSRF 공격 방지를 위한 상태 토큰을 생성하고 쿠키에 저장합니다.
func generateStateOauthCookie(w http.ResponseWriter) string {
	b := make([]byte, 16) // 16바이트 버퍼 생성
	rand.Read(b) // 랜덤 데이터로 채우기
	state := base64.URLEncoding.EncodeToString(b) // base64로 인코딩
	
	// 쿠키 생성 (24시간 유효)
	cookie := &http.Cookie{
		Name:"oauthstate", 
		Value: state, 
		Expires: time.Now().Add(1 * 24 * time.Hour),
	}
	http.SetCookie(w, cookie) // 응답에 쿠키 설정
	return state
}

// googleOAuthCallbackHandler는 Google OAuth 인증 후 콜백을 처리하는 핸들러입니다.
// 상태 토큰을 검증하고, 사용자 정보를 가져와 세션에 저장합니다.
func googleOAuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	oauthstate, _ := r.Cookie("oauthstate") // 쿠키에서 상태 토큰 가져오기

	// 상태 토큰 검증 (CSRF 공격 방지)
	if r.FormValue("state") != oauthstate.Value {
		errMsg := fmt.Sprintf("invalid google oauth state cookie: %s, state:%s\n", oauthstate.Value, r.FormValue("state"))
		log.Printf(errMsg)
		http.Error(w, errMsg, http.StatusInternalServerError)
		return
	}

	// Google API에서 사용자 정보 가져오기
	userInfo, err := getGoogleUserInfo(r.FormValue("code"))
	if err != nil {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 사용자 정보 JSON 파싱
	var user GoogleUserId
	err = json.Unmarshal(userInfo, &user)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	// 세션 가져오기
	session, err := Store.Get(r, "session")
	if err != nil {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 세션에 사용자 ID 저장
	session.Values["id"] = user.ID
	err = sessions.Save(r, w)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	// 메인 페이지로 리디렉션
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

// Google API 사용자 정보 엔드포인트 URL
var oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

// getGoogleUserInfo는 인증 코드를 사용하여 Google API에서 사용자 정보를 가져옵니다.
func getGoogleUserInfo(code string) ([]byte, error) {
	// 인증 코드를 액세스 토큰으로 교환
	token, err := GoogleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("Failed to exchange %s\n", err.Error())
	}
	
	// 액세스 토큰을 사용하여 사용자 정보 요청
	res, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("Failed to get user info %s\n", err.Error())
	}

	// 응답 본문 읽기
	return ioutil.ReadAll(res.Body)
}
