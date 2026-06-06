// Package decorator_pattern은 Go에서 데코레이터 패턴을 구현하는 방법을 보여줍니다.
// 데코레이터 패턴은 기존 객체에 새로운 기능을 동적으로 추가할 수 있게 해주는 디자인 패턴입니다.
package decorator_pattern

import (
	"fmt"
	"net/http" // HTTP 서버 및 클라이언트를 위한 패키지
)

// indexHandler는 루트 경로 요청을 처리하는 핸들러 함수입니다.
// "Hello World" 메시지를 응답으로 반환합니다.
func indexHandler(rw http.ResponseWriter, r *http.Request) {
	fmt.Fprint(rw, "Hello World")
}

// NewHandler는 데코레이터 패턴이 적용된 HTTP 핸들러를 생성합니다.
// 기본 핸들러(ServeMux)에 로깅 기능을 추가한 데코레이터를 반환합니다.
func NewHandler() http.Handler {
	// 기본 HTTP 핸들러(ServeMux) 생성
	mux := http.NewServeMux()
	
	// 루트 경로에 indexHandler 등록
	mux.HandleFunc("/", indexHandler)
	
	// 기본 핸들러를 로깅 데코레이터로 감싸기
	h := NewDecoHandler(mux, logger)
	
	return h
}