// Package decorator_pattern의 deco.go 파일은 HTTP 핸들러를 위한 
// 데코레이터 패턴의 핵심 구현을 포함합니다.
package decorator_pattern

import (
	"log"       // 로깅을 위한 패키지
	"net/http"  // HTTP 서버 및 클라이언트를 위한 패키지
	"time"      // 시간 관련 기능을 위한 패키지
)

// DecoratorFunc는 HTTP 핸들러를 장식(데코레이트)하는 함수 타입입니다.
// 원래 핸들러를 호출하기 전후에 추가 작업을 수행할 수 있습니다.
type DecoratorFunc func (http.ResponseWriter, *http.Request, http.Handler)

// DecoHandler 구조체는 데코레이터 패턴을 구현하는 HTTP 핸들러입니다.
// 원래 핸들러(h)와 데코레이터 함수(fn)를 포함합니다.
type DecoHandler struct {
	fn DecoratorFunc // 데코레이터 함수
	h http.Handler   // 원래 HTTP 핸들러
}

// ServeHTTP는 HTTP 요청을 처리하는 메서드입니다.
// http.Handler 인터페이스를 구현합니다.
// 데코레이터 함수를 호출하여 원래 핸들러를 장식합니다.
func (self *DecoHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	self.fn(w, r, self.h) // 데코레이터 함수 호출
}

// NewDecoHandler는 새로운 데코레이터 핸들러를 생성합니다.
// 원래 핸들러와 데코레이터 함수를 받아 데코레이터 패턴이 적용된 핸들러를 반환합니다.
func NewDecoHandler(h http.Handler, fn DecoratorFunc) http.Handler {
	return &DecoHandler{
		fn: fn, // 데코레이터 함수 설정
		h: h,   // 원래 핸들러 설정
	}
}

// logger는 HTTP 요청 처리 시간을 로깅하는 데코레이터 함수입니다.
// 요청 처리 전후에 로그를 출력하여 처리 시간을 측정합니다.
func logger(rw http.ResponseWriter, r *http.Request, h http.Handler) {
	start := time.Now() // 시작 시간 기록
	log.Print("[LOGGER1] Started") // 시작 로그 출력
	
	h.ServeHTTP(rw, r) // 원래 핸들러 호출
	
	// 완료 로그 출력 (경과 시간 포함)
	log.Print("[LOGGER1] Completed time: ", time.Since(start).Milliseconds())
}