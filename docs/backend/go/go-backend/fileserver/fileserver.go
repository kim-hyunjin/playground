// Package fileserver는 정적 파일 서빙과 파일 업로드 기능을 제공하는 
// 간단한 파일 서버를 구현합니다.
package fileserver

import (
	"fmt"
	"io"         // 입출력 작업을 위한 패키지
	"net/http"   // HTTP 서버 및 클라이언트를 위한 패키지
	"os"         // 운영체제 기능을 위한 패키지
)

// uploadHandler는 파일 업로드 요청을 처리하는 핸들러 함수입니다.
// 클라이언트가 POST 요청으로 파일을 업로드하면 이를 서버에 저장합니다.
func uploadHandler(rw http.ResponseWriter, r *http.Request) {
	// 폼에서 업로드된 파일 가져오기
	uploadFile, header, err := r.FormFile("upload_file")
	if err != nil {
		// 파일 가져오기 실패 시 400 Bad Request 응답
		rw.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(rw, err)
		return
	}
	defer uploadFile.Close() // 함수 종료 시 업로드 파일 닫기

	// 업로드 디렉토리 생성 (없는 경우)
	dirname := "./uploads"
	os.MkdirAll(dirname, 0777) // 모든 사용자에게 읽기/쓰기/실행 권한 부여
	
	// 저장할 파일 경로 생성
	filepath := fmt.Sprintf("%s/%s", dirname, header.Filename)
	
	// 새 파일 생성
	file, err := os.Create(filepath)
	defer file.Close() // 함수 종료 시 생성된 파일 닫기
	if err != nil {
		// 파일 생성 실패 시 500 Internal Server Error 응답
		rw.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(rw, err)
		return
	}
	
	// 업로드된 파일 내용을 새 파일에 복사
	io.Copy(file, uploadFile)
	
	// 성공 응답 (200 OK)과 저장된 파일 경로 반환
	rw.WriteHeader(http.StatusOK)
	fmt.Fprint(rw, filepath)
}

// Start 함수는 파일 서버를 초기화하고 시작합니다.
// 정적 파일 서빙과 파일 업로드 엔드포인트를 설정합니다.
func Start() {
	// 서버 시작 메시지 출력
	fmt.Println("File Server Started!")
	
	// 루트 경로에 정적 파일 서버 설정
	// fileserver/public 디렉토리의 파일들을 서빙
	http.Handle("/", http.FileServer(http.Dir("fileserver/public")))

	// /uploads 경로에 파일 업로드 핸들러 등록
	http.HandleFunc("/uploads", uploadHandler)

	// 3000번 포트에서 HTTP 서버 시작
	http.ListenAndServe(":3000", nil)
}