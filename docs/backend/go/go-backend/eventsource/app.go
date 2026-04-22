// Package main은 Server-Sent Events(SSE)를 사용한 실시간 채팅 애플리케이션을 구현합니다.
// 이 애플리케이션은 사용자들이 실시간으로 메시지를 주고받을 수 있는 채팅 기능을 제공합니다.
package main

import (
	"encoding/json"  // JSON 인코딩/디코딩을 위한 패키지
	"fmt"
	"net/http"       // HTTP 서버 및 클라이언트를 위한 패키지
	"strconv"        // 문자열 변환을 위한 패키지
	"time"           // 시간 관련 기능을 위한 패키지

	"github.com/antage/eventsource"  // Server-Sent Events 구현을 위한 패키지
	"github.com/gorilla/pat"         // HTTP 라우팅을 위한 패키지
	"github.com/urfave/negroni"      // HTTP 미들웨어를 위한 패키지
)

// Message 구조체는 채팅 메시지의 형식을 정의합니다.
type Message struct {
	Name string `json:"name"` // 발신자 이름
	Msg  string `json:"msg"`  // 메시지 내용
}

// msgCh는 메시지를 전달하기 위한 채널입니다.
// 여러 HTTP 핸들러에서 이벤트 소스로 메시지를 전달하는 데 사용됩니다.
var msgCh chan Message

// postMsgHandler는 새로운 채팅 메시지를 처리하는 핸들러입니다.
// 클라이언트가 POST 요청으로 메시지를 보내면 이를 처리합니다.
func postMsgHandler(w http.ResponseWriter, r *http.Request) {
	msg := r.FormValue("msg")   // 폼에서 메시지 추출
	name := r.FormValue("name") // 폼에서 이름 추출
	sendMsg(name, msg)          // 메시지 전송
}

// addUserHandler는 새로운 사용자가 입장했을 때 처리하는 핸들러입니다.
// 사용자 입장 메시지를 모든 클라이언트에게 브로드캐스트합니다.
func addUserHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("name")
	sendMsg("", fmt.Sprintf("add user: %s", username))
}

// leftUserHandler는 사용자가 퇴장했을 때 처리하는 핸들러입니다.
// 사용자 퇴장 메시지를 모든 클라이언트에게 브로드캐스트합니다.
func leftUserHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	sendMsg("", fmt.Sprintf("left user: %s", username))
}

// sendMsg는 메시지를 채널에 전송하는 헬퍼 함수입니다.
// 이름과 메시지 내용을 받아 Message 구조체를 생성하여 채널에 전송합니다.
func sendMsg(name string, msg string) {
	msgCh <- Message{name, msg}
}

// processMsgCh는 메시지 채널을 감시하고 이벤트를 전송하는 고루틴입니다.
// 채널에서 메시지를 받아 JSON으로 변환하여 EventSource를 통해 모든 클라이언트에게 전송합니다.
func processMsgCh(es eventsource.EventSource) {
	for msg := range msgCh {
		data, _ := json.Marshal(msg)
		// 각 메시지를 JSON으로 변환하여 EventSource로 전송
		// 이벤트 ID로 현재 시간의 나노초를 사용하여 고유성 보장
		es.SendEventMessage(string(data), "", strconv.Itoa(time.Now().Nanosecond()))
	}
}

// main 함수는 애플리케이션의 진입점입니다.
// 채널 초기화, 이벤트 소스 설정, 라우팅 설정, 서버 시작 등을 수행합니다.
func main() {
	// 메시지 채널 초기화
	msgCh = make(chan Message)

	// EventSource 서버 생성 (SSE 구현)
	es := eventsource.New(nil, nil)
	defer es.Close() // 프로그램 종료 시 이벤트 소스 닫기

	// 메시지 처리 고루틴 시작
	go processMsgCh(es)

	// 라우터 설정 (gorilla/pat 사용)
	mux := pat.New()
	mux.Post("/messages", postMsgHandler) // 메시지 전송 엔드포인트
	mux.Handle("/stream", es)             // SSE 스트림 엔드포인트
	mux.Post("/users", addUserHandler)    // 사용자 입장 엔드포인트
	mux.Delete("/users", leftUserHandler) // 사용자 퇴장 엔드포인트

	// Negroni 미들웨어 설정
	// Classic()은 기본 로깅, 복구, 정적 파일 서빙 미들웨어를 포함
	n := negroni.Classic()
	n.UseHandler(mux)

	// 3000번 포트에서 HTTP 서버 시작
	http.ListenAndServe(":3000", n)
}
