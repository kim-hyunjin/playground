# 📝 Note Quiz (노트 퀴즈)

공부한 노트(이미지, PDF)를 업로드하면 AI가 핵심 내용을 분석하여 **객관식 문제를 자동으로 생성**해주는 AI 학습 보조 웹 서비스입니다.

---

## 🚀 주요 기능

- **AI 문제 생성**: PDF나 이미지 파일을 업로드하면 로컬 LLM(Ollama)이 내용을 분석하여 퀴즈를 생성합니다.
- **실시간 퀴즈 풀기**: 생성된 퀴즈를 즉시 풀고, 정답 여부와 상세 해설을 확인할 수 있습니다.
- **오답 노트 (회원 전용)**: 틀린 문제만 따로 모아 복습하고, 해결된 문제는 관리할 수 있습니다.
- **퀴즈 공유**: 생성한 퀴즈를 고유 링크로 공유하여 친구들과 함께 풀 수 있습니다.
- **데일리 퀴즈 알림 (회원 전용)**: 설정한 시간에 맞춰 저장된 노트에서 새로운 문제를 자동으로 생성하고 메일로 알림을 보냅니다.
- **비로그인 지원**: 회원가입 없이도 파일 업로드 및 퀴즈 생성을 체험해 볼 수 있습니다.

---

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 25)
- **Security**: Spring Security + JWT (Access/Refresh Token)
- **Database**: H2 Database (File Mode)
- **Data JPA**: Spring Data JPA
- **AI Integration**: Spring WebClient (Ollama API)
- **Parsing**: Apache PDFBox (PDF 추출)
- **Email**: Spring Boot Starter Mail (알림 발송)

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **State/Routing**: React Router 7, Context API
- **Icons**: Lucide React

### AI (Local LLM)
- **Engine**: [Ollama](https://ollama.com/)
- **Model**: `gemma4` (설정으로 변경 가능)

---

## 📋 사전 준비 사항

프로젝트를 실행하기 위해 다음 소프트웨어가 설치되어 있어야 합니다.

1. **Java 25** 이상
2. **Node.js 20** 이상 (npm 포함)
3. **Ollama**: 설치 후 모델 다운로드가 필요합니다.
   ```bash
   ollama pull gemma4
   ```

---

## 🏃 실행 방법

### 1. Backend 설정
`backend/src/main/resources/application.yml` 파일에서 이메일 알림을 위한 SMTP 설정을 완료해야 합니다.

```bash
cd backend
./gradlew bootRun
```
- 서버 주소: `http://localhost:8080`
- H2 콘솔: `http://localhost:8080/h2-console`

### 2. Frontend 설정
`.env` 파일에 API 주소가 설정되어 있는지 확인합니다 (`VITE_API_BASE_URL=http://localhost:8080`).

```bash
cd frontend
npm install
npm run dev
```
- 접속 주소: `http://localhost:5173`

---

## 📁 프로젝트 구조

```text
note-quiz-hj/
├── backend/                # Spring Boot 애플리케이션
│   ├── src/main/java/      # 백엔드 소스 코드
│   └── src/main/resources/ # 설정 파일 (application.yml)
├── frontend/               # React 애플리케이션
│   ├── src/pages/          # 주요 화면 컴포넌트
│   ├── src/api/            # Axios API 연동
│   └── src/context/        # 인증 상태 관리
├── PRD.md                  # 제품 요구 사항 정의서
└── plan.md                 # 상세 개발 계획서
```

---

## 🔗 주요 화면 흐름

1. **홈**: 노트 파일 업로드 및 문제 수 선택 (5/10/20개)
2. **로딩**: AI가 노트를 분석하여 문제 생성 (약 20~30초 소요)
3. **퀴즈**: 한 문제씩 풀이 및 즉시 피드백/해설 확인
4. **결과**: 전체 점수 확인 및 오답 목록 검토
5. **마이페이지**: 내 퀴즈 목록 관리, 공유 링크 생성, 알림 설정
