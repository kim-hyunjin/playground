// Package model의 sqliteHandler.go 파일은 SQLite 데이터베이스를 사용하여 
// DbHandler 인터페이스를 구현합니다.
package model

import (
	"database/sql" // SQL 데이터베이스 작업을 위한 패키지
	"time"

	_ "github.com/mattn/go-sqlite3" // SQLite 드라이버 (익명 임포트)
)

// sqliteHandler 구조체는 SQLite 데이터베이스 연결을 관리하는 구조체입니다.
type sqliteHandler struct {
	db *sql.DB // 데이터베이스 연결
}

// GetTodos는 특정 세션 ID에 속한 모든 할 일 항목을 데이터베이스에서 조회합니다.
func (s *sqliteHandler) GetTodos(sessionId string) []*Todo {
	todos := []*Todo{} // 결과를 저장할 슬라이스
	
	// 세션 ID에 해당하는 할 일 항목 조회 쿼리 실행
	rows, err := s.db.Query("SELECT id, name, completed, createdAt FROM todos WHERE sessionId = ?", sessionId)
	if err != nil {
		panic(err) // 쿼리 실행 실패 시 패닉
	}
	defer rows.Close() // 함수 종료 시 rows 리소스 해제
	
	// 결과 행을 순회하며 Todo 객체로 변환
	for rows.Next() {
		var todo Todo
		rows.Scan(&todo.ID, &todo.Name, &todo.Completed, &todo.CreatedAt) // 행 데이터를 Todo 구조체에 매핑
		todo.SessionId = sessionId // 세션 ID 설정
		todos = append(todos, &todo) // 결과 슬라이스에 추가
	}
	return todos
}

// AddTodo는 새로운 할 일 항목을 데이터베이스에 추가합니다.
func (s *sqliteHandler) AddTodo(name string, sessionId string) *Todo {
	// INSERT 쿼리 준비
	stmt, err := s.db.Prepare("INSERT INTO todos (sessionId, name, completed, createdAt) VALUES (?, ?, ?, datetime('now'))")
	if err != nil {
		panic(err) // 쿼리 준비 실패 시 패닉
	}
	
	// 쿼리 실행
	result, err := stmt.Exec(sessionId, name, false)
	if err != nil {
		panic(err) // 쿼리 실행 실패 시 패닉
	}
	
	// 삽입된 행의 ID 가져오기
	id, _ := result.LastInsertId()
	
	// 새로운 Todo 객체 생성
	var todo Todo
	todo.ID = int(id)
	todo.SessionId = sessionId
	todo.Name = name
	todo.Completed = false
	todo.CreatedAt = time.Now()
	
	return &todo
}

// DeleteTodo는 특정 ID의 할 일 항목을 데이터베이스에서 삭제합니다.
func (s *sqliteHandler) DeleteTodo(id int) bool {
	// DELETE 쿼리 준비
	stmt, err := s.db.Prepare("DELETE FROM todos WHERE id = ?")
	if err != nil {
		panic(err) // 쿼리 준비 실패 시 패닉
	}
	
	// 쿼리 실행
	result, err := stmt.Exec(id)
	if err != nil {
		panic(err) // 쿼리 실행 실패 시 패닉
	}
	
	// 영향받은 행 수 확인 (0보다 크면 삭제 성공)
	cnt, _ := result.RowsAffected()
	return cnt > 0
}

// CompleteTodo는 특정 ID의 할 일 항목의 완료 상태를 변경합니다.
func (s *sqliteHandler) CompleteTodo(id int, complete bool) bool {
	// UPDATE 쿼리 준비
	stmt, err := s.db.Prepare("UPDATE todos SET completed = ? WHERE id = ?")
	if err != nil {
		panic(err) // 쿼리 준비 실패 시 패닉
	}
	
	// 쿼리 실행
	result, err := stmt.Exec(complete, id)
	if err != nil {
		panic(err) // 쿼리 실행 실패 시 패닉
	}
	
	// 영향받은 행 수 확인 (0보다 크면 업데이트 성공)
	cnt, _ := result.RowsAffected()
	return cnt > 0
}

// Close는 데이터베이스 연결을 닫습니다.
func (s *sqliteHandler) Close() {
	s.db.Close()
}

// newSqliteHandler는 새로운 SQLite 데이터베이스 핸들러를 생성합니다.
// 데이터베이스 파일이 없으면 새로 생성하고, 테이블과 인덱스를 초기화합니다.
func newSqliteHandler(filepath string) DbHandler {
	// SQLite 데이터베이스 연결
	database, err := sql.Open("sqlite3", filepath)
	if err != nil {
		panic(err) // 데이터베이스 연결 실패 시 패닉
	}
	
	// todos 테이블 및 인덱스 생성 쿼리 준비 및 실행
	stmt, _ := database.Prepare(
		`CREATE TABLE IF NOT EXISTS todos (
			id			INTEGER PRIMARY KEY AUTOINCREMENT, -- 자동 증가 기본 키
			sessionId 	STRING,                           -- 사용자 세션 ID
			name		TEXT,                             -- 할 일 내용
			completed 	BOOLEAN,                          -- 완료 여부
			createdAt 	DATETIME                          -- 생성 시간
		);
		CREATE INDEX IF NOT EXISTS sessionIdIndexOnTodos ON todos (sessionId ASC); -- 세션 ID로 빠른 조회를 위한 인덱스
		`)
	stmt.Exec()
	
	// SQLite 핸들러 반환
	return &sqliteHandler{db:database}
}