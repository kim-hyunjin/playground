// Package model은 Todo 애플리케이션의 데이터 모델과 데이터베이스 인터페이스를 정의합니다.
package model

import "time" // 시간 관련 기능을 위한 패키지

// Todo 구조체는 할 일 항목의 데이터 구조를 정의합니다.
type Todo struct {
	ID int `json:"id"`                   // 할 일 항목의 고유 식별자
	SessionId string `json:"sessionId"`  // 사용자 세션 ID (소유자 식별)
	Name string `json:"name"`            // 할 일 항목의 이름/내용
	Completed bool `json:"completed"`    // 완료 여부
	CreatedAt time.Time `json:"created_at"` // 생성 시간
}

// DbHandler 인터페이스는 데이터베이스 작업을 추상화합니다.
// 이 인터페이스를 구현하는 다양한 데이터베이스 핸들러를 사용할 수 있습니다.
type DbHandler interface {
	// GetTodos는 특정 세션 ID에 속한 모든 할 일 항목을 반환합니다.
	GetTodos(sessionId string) []*Todo
	
	// AddTodo는 새로운 할 일 항목을 추가하고 추가된 항목을 반환합니다.
	AddTodo(name string, sessionId string) *Todo
	
	// DeleteTodo는 특정 ID의 할 일 항목을 삭제하고 성공 여부를 반환합니다.
	DeleteTodo(id int) bool
	
	// CompleteTodo는 특정 ID의 할 일 항목의 완료 상태를 변경하고 성공 여부를 반환합니다.
	CompleteTodo(id int, complete bool) bool
	
	// Close는 데이터베이스 연결을 닫습니다.
	Close()
}

// NewDbHandler는 새로운 데이터베이스 핸들러를 생성합니다.
// 현재는 SQLite 핸들러만 지원하지만, 필요에 따라 다른 구현체로 변경할 수 있습니다.
func NewDbHandler(filepath string) DbHandler {
	return newSqliteHandler(filepath) // SQLite 데이터베이스 핸들러 생성
}
