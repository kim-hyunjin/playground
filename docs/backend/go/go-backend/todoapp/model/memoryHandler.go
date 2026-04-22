// Package model의 memoryHandler.go 파일은 메모리 내에서 
// DbHandler 인터페이스를 구현합니다.
// 주로 테스트나 개발 목적으로 사용됩니다.
package model

import "time" // 시간 관련 기능을 위한 패키지

// memoryHandler 구조체는 메모리 내에서 할 일 항목을 관리하는 구조체입니다.
type memoryHandler struct {
	todoMap map[int]*Todo // ID를 키로 하는 할 일 항목 맵
}

// newMemoryHandler는 새로운 메모리 핸들러를 생성합니다.
func newMemoryHandler() DbHandler {
	m := &memoryHandler{}
	m.todoMap = make(map[int]*Todo) // 빈 맵 초기화
	return m
}

// GetTodos는 모든 할 일 항목을 반환합니다.
// 참고: 이 구현에는 세션 ID 필터링이 누락되어 있어 모든 사용자의 할 일이 반환됩니다.
// 실제 사용 시에는 세션 ID로 필터링하는 로직을 추가해야 합니다.
func (m *memoryHandler) GetTodos(sessionId string) []*Todo {
	list := []*Todo{} // 결과를 저장할 슬라이스
	
	// 모든 할 일 항목을 순회하며 슬라이스에 추가
	for _, v := range m.todoMap {
		list = append(list, v)
	}
	return list
}

// AddTodo는 새로운 할 일 항목을 추가합니다.
func (m *memoryHandler) AddTodo(name string, sessionId string) *Todo {
	// 새 ID 생성 (맵의 크기 + 1)
	id := len(m.todoMap) + 1
	
	// 새 할 일 항목 생성
	todo := &Todo{id, sessionId, name, false, time.Now()}
	
	// 맵에 저장
	m.todoMap[id] = todo
	
	return todo
}

// DeleteTodo는 특정 ID의 할 일 항목을 삭제합니다.
func (m *memoryHandler) DeleteTodo(id int) bool {
	// ID가 존재하는지 확인
	if _, ok := m.todoMap[id]; ok {
		// 맵에서 항목 삭제
		delete(m.todoMap, id)
		return true // 삭제 성공
	}
	return false // 해당 ID가 없음
}

// CompleteTodo는 특정 ID의 할 일 항목의 완료 상태를 변경합니다.
func (m *memoryHandler) CompleteTodo(id int, complete bool) bool {
	// ID가 존재하는지 확인
	if todo, ok := m.todoMap[id]; ok {
		// 완료 상태 변경
		todo.Completed = complete
		return true // 변경 성공
	}
	return false // 해당 ID가 없음
}

// Close는 리소스를 정리합니다.
// 메모리 핸들러는 특별히 정리할 리소스가 없으므로 빈 구현입니다.
func (m *memoryHandler) Close() {
	// 메모리 핸들러는 닫을 리소스가 없음
}