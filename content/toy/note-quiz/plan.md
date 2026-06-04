# Note Quiz — 작업 계획

## 개발 순서 개요

```
[Phase 1] 프로젝트 초기 설정
[Phase 2] DB 엔티티 & 스키마
[Phase 3] 인증 (JWT)
[Phase 4] 파일 업로드 & 텍스트 추출
[Phase 5] LLM 연동 & 퀴즈 생성
[Phase 6] 퀴즈 풀기 & 결과 제출
[Phase 7] 로그인 전용 기능
[Phase 8] 알림 스케줄러
[Phase 9] 프론트엔드
```

---

## Phase 1. 프로젝트 초기 설정

### Backend (Spring Boot)

- [x] Spring Boot 프로젝트 생성 (Gradle, Java 25)
- [x] 의존성 추가
  - Spring Web, Spring Security, Spring Data JPA
  - H2 Database
  - Spring Boot Starter Mail
  - jjwt (JWT)
  - Apache PDFBox
  - tess4j (Tesseract OCR)
  - Spring WebClient
- [x] `application.yml` 기본 설정 (H2, 포트, JPA DDL)
- [x] 전역 예외 핸들러 구성 (`@RestControllerAdvice`)
- [x] 공통 에러 응답 형식 구현 (`code`, `message`, `status`)

### Frontend (React)

- [x] Vite + React 프로젝트 생성
- [x] 의존성 추가
  - React Router v6
  - Axios
  - Tailwind CSS
- [x] 라우터 구성 (기본 페이지 경로 설정)
- [x] Axios 인스턴스 생성 (baseURL, 인터셉터 뼈대)

---

## Phase 2. DB 엔티티 & 스키마

- [x] `users` 엔티티
  - `id`, `email`, `password_hash`, `nickname`, `created_at`
- [x] `notes` 엔티티
  - `id`, `note_id` (UUID), `title`, `extracted_text` (TEXT), `created_at`
- [x] `quizzes` 엔티티
  - `id`, `user_id` (nullable), `note_id` (nullable), `created_at`, `share_token`
- [x] `questions` 엔티티
  - `id`, `quiz_id`, `body`, `options` (JSON), `answer`, `explanation`, `order_num`
- [x] `quiz_results` 엔티티
  - `id`, `quiz_id`, `user_id` (nullable), `score`, `total`, `created_at`
- [x] `wrong_answers` 엔티티
  - `id`, `user_id`, `question_id`, `resolved`, `created_at`
- [x] `notification_settings` 엔티티
  - `id`, `user_id`, `daily_quiz_enabled`, `daily_quiz_time`
- [x] `notification_target_notes` 엔티티
  - `id`, `notification_setting_id`, `note_id`, `question_count`
- [x] Repository 인터페이스 작성

---

## Phase 3. 인증 (JWT)

### Backend

- [x] `POST /api/auth/signup` — 회원가입
  - 이메일 중복 검증
  - bcrypt 비밀번호 해시 저장
- [x] `POST /api/auth/login` — 로그인
  - Access Token 발급 (1시간, HS256)
  - Refresh Token 발급 (30일, HttpOnly 쿠키)
- [x] `POST /api/auth/refresh` — 토큰 갱신
  - 쿠키의 Refresh Token 검증 후 새 Access Token 발급
- [x] Spring Security 설정
  - JWT 필터 구성
  - 공개 경로 / 인증 필요 경로 분리

### Frontend

- [x] 로그인 페이지 (`/login`)
- [x] 회원가입 페이지 (`/signup`)
- [x] Axios 인터셉터 완성
  - 요청 시 `Authorization: Bearer {token}` 헤더 자동 첨부
  - 401 감지 → `/api/auth/refresh` 호출 → 원래 요청 재시도
  - Refresh Token 만료 시 `/login`으로 리다이렉트
- [x] 로그인 상태 전역 관리 (Context API 또는 Zustand)
- [x] 헤더 컴포넌트 — 로그인 여부에 따라 버튼 분기

---

## Phase 4. 노트 업로드 & 텍스트 추출

### Backend

- [x] `POST /api/notes` 구현
  - 요청 시 노트 '제목(title)' 수신
  - 확장자 검증 (PDF, PNG, JPG, JPEG)
  - 크기 검증 (≤ 20MB)
  - PDF → Apache PDFBox 텍스트 추출
  - 이미지 → Tesseract OCR (kor + eng)
  - 텍스트 정제 (연속 공백·특수문자 정규화)
  - `notes` 테이블에 `note_id`, `title`, `extracted_text` 저장 (원본 파일 삭제/미저장)
  - 응답: `noteId`, `title`, `extractedTextLength`

### Frontend

- [x] 홈 화면 (`/`) — 파일 업로드 UI
  - 노트 제목 입력 필드 추가
  - 드래그 앤 드롭 + 클릭 업로드
  - 업로드 후 파일명(임시) 및 썸네일 표시
  - 파일 형식/크기 오류 시 인라인 에러 메시지

---

## Phase 5. LLM 연동 & 퀴즈 생성

### Backend

- [x] Ollama 클라이언트 구현 (Spring WebClient)
  - `POST http://localhost:11434/api/generate` 호출
  - 타임아웃 30초, 실패 시 1회 재시도
- [x] 프롬프트 템플릿 구성 (`{questionCount}`, `{extractedText}` 치환)
- [x] LLM 응답 파싱
  - 정규식으로 JSON 배열 추출
  - 파싱 실패 시 `TEXT_EXTRACT_FAILED` 에러 반환
- [x] `POST /api/quiz/generate` 구현
  - `notes` 테이블에서 추출 텍스트 조회 (`noteId` 이용)
  - LLM 문제 생성
  - `quizzes` + `questions` 테이블 저장
  - 로그인 사용자: `user_id` 연결하여 내 퀴즈 목록에 자동 저장
  - 응답: `quizId`, `questions` 배열

### Frontend

- [x] 홈 화면 — 문제 수 선택 (5 / 10 / 20) 및 "문제 생성하기" 버튼
- [x] 로딩 화면 — 스피너 + [로딩] AI 분석 중... 메시지
- [x] 문제 생성 실패 시 모달 알림 + "다시 시도" 버튼

---

## Phase 6. 퀴즈 풀기 & 결과 제출

### Backend

- [x] `GET /api/quiz/{quizId}` — 퀴즈 조회
- [x] `POST /api/quiz/{quizId}/result` — 결과 제출
  - 답안 채점 후 `quiz_results` 저장
  - 로그인 사용자: 오답을 `wrong_answers` 저장
  - 응답: `resultId`, `score`, `total`, `wrongQuestions`
- [x] 비로그인 세션 처리
  - 퀴즈 데이터를 `sessionStorage['nq_quiz_{quizId}']`에 저장

### Frontend

- [x] 퀴즈 화면 (`/quiz/:quizId`)
  - 문제 한 개씩 순서대로 표시
  - 보기 선택 즉시 정답/오답 피드백
  - 정답 및 해설 표시
  - 진행률 바 (N / 전체)
  - "다음 문제" 버튼
- [x] 결과 화면 (`/result/:quizId`)
  - 점수 및 정답률 표시
  - 오답 문제 목록 + 해설
  - "다시 풀기" / "새 파일 업로드" 버튼
  - 로그인 시: "오답 노트에 추가" 버튼

---

## Phase 7. 로그인 전용 기능

### Backend

- [x] `GET /api/my/notes` — 내 노트 목록 조회
- [x] `GET /api/my/notes/{noteId}/quizzes` — 특정 노트의 퀴즈 목록 조회
- [x] `DELETE /api/my/quizzes/{quizId}` — 내 퀴즈 삭제
- [x] `POST /api/my/quizzes/{quizId}/share` — 공유 링크 생성
  - `share_token`: UUID 앞 6자리, 충돌 시 재생성 (최대 3회)
- [x] `GET /api/share/{shareToken}` — 공유 퀴즈 조회 (비로그인 포함)
- [x] `GET /api/my/wrong` — 오답 목록 조회
- [x] `PATCH /api/my/wrong/{wrongId}/resolve` — 오답 해결 처리
- [x] `GET /api/my/settings/notification` — 알림 설정 및 대상 노트 목록 조회
- [x] `PUT /api/my/settings/notification` — 알림 설정 변경 (대상 노트 선택 및 문제 수 포함)

### Frontend

- [x] 마이페이지 내 노트 목록 (`/my/notes`)
  - 노트 목록을 계층적으로 표시 (클릭 시 퀴즈 목록 확장)
  - 퀴즈 항목: 생성일시, 문제 수, 풀기 / 공유 링크 복사 / 삭제 버튼
- [x] 오답 노트 (`/my/wrong`)
  - 오답 문제 목록
  - "오답 퀴즈 시작" 버튼
  - 오답 해결 시 목록에서 제거
- [x] 알림 설정 (`/my/settings`)
  - 오늘의 퀴즈 ON/OFF + 시간 선택 + 생성 문제 수 선택
  - 오늘의 퀴즈 대상 노트 선택 (체크박스 목록)
  - 저장 버튼
- [x] 공유 퀴즈 화면 (`/share/:quizId`)

---

## Phase 8. 알림 스케줄러

- [x] Spring Scheduler 활성화 (`@EnableScheduling`)
- [x] 오늘의 퀴즈 스케줄러
  - 매분 실행, `daily_quiz_time` 일치 사용자 조회
  - 사용자가 선택한 각 노트의 기존 추출 텍스트 재사용 → 설정된 개수만큼 LLM 문제 생성 → 독립된 `quizzes` 세트로 저장 → 이메일 발송
- [x] 발송 실패 시 로그 기록 처리

---

## Phase 9. 마무리 & 검증

- [x] API 전체 동작 테스트
- [x] 비로그인 / 로그인 흐름 E2E 확인
- [x] 공유 링크 접속 흐름 확인
- [x] 에러 케이스 확인 (파일 형식 오류, LLM 타임아웃 등)
- [x] H2 Console로 데이터 저장 확인 (`/h2-console`)
