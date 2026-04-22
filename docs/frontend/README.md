# 현대 웹 프런트엔드 개발: React에서 Next.js까지의 여정

본 프로젝트는 사용자 인터페이스(UI)를 구축하는 핵심 기술인 **React**와 이를 확장하여 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG)을 지원하는 **Next.js**를 중심으로 다양한 프런트엔드 기술을 실습한 공간입니다.

---

## 🚀 1. Next.js: 성능과 SEO를 위한 프레임워크

Next.js는 React 기반의 프레임워크로, 정적 생성(SSG)과 서버 렌더링(SSR)을 통해 빠른 로딩 속도와 우수한 검색 엔진 최적화(SEO)를 제공합니다.

### 정적 사이트 생성 (SSG) 로직 예시
마크다운 파일을 읽어 정적인 HTML 페이지로 미리 빌드하는 과정입니다.

```typescript
// frontend/nextjs/nextjs-blog/lib/posts.ts
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matter를 이용한 메타데이터 파싱
  const matterResult = matter(fileContents);
  
  // remark를 이용한 마크다운 -> HTML 변환
  const processedContent = await remark().use(html).process(matterResult.content);
  return { id, contentHtml: processedContent.toString(), ...matterResult.data };
}
```

---

## ⚛️ 2. React: 컴포넌트 기반 UI 설계

단순한 UI 조각들을 컴포넌트로 분리하여 재사용성을 높이고, **상태 관리(State Management)**를 통해 복잡한 데이터를 효율적으로 처리합니다.

### 주요 학습 프로젝트
- **Twitter Clone (`frontend/react/twitter-clone`):** Firebase를 연동한 실시간 데이터 업데이트 및 사용자 인증 처리.
- **Redux 실습:** 복잡한 앱 전역 상태를 예측 가능한 방식으로 관리하는 패턴 학습.
- **Hooks 활용:** `useState`, `useEffect`, `useCallback` 등을 통한 선언적 프로그래밍 구현.

---

## 🌐 3. 실시간 웹 기술 (WebRTC & WebSocket)

브라우저 간 직접 통신(P2P)을 가능하게 하는 WebRTC를 통해 화상 회의나 실시간 스트리밍 시스템을 구현합니다.

### WebRTC 핵심 프로세스
1. **Media Stream:** 카메라/마이크 권한 획득 및 스트림 처리.
2. **Signaling:** 서로의 연결 정보를 주고받는 과정 (Socket.io 활용).
3. **P2P Connection:** 중간 서버 없이 브라우저 간 직접 데이터 전송.

---

## 🛠 주요 도구 및 라이브러리
- **Frameworks:** Next.js, React, Vue.
- **Styling:** CSS Modules, Styled Components, Tailwind CSS.
- **Tools:** Webpack, Babel, ESLint, Prettier.
- **Libraries:** Redux, React Query, Axios, Socket.io.

---

## 📈 학습 포인트
- **Rendering Strategies:** 클라이언트 사이드 렌더링(CSR)과 서버 사이드 렌더링(SSR)의 차이점 및 적절한 선택 기준.
- **Performance Optimization:** 이미지 최적화, 코드 분할(Code Splitting), 메모이제이션을 통한 렌더링 최적화.
- **State Flow:** 단방향 데이터 흐름의 이해와 복잡한 비즈니스 로직 분리 방식.

---
*본 저장소는 사용자에게 최고의 경험을 제공하기 위한 프런트엔드 엔지니어링의 발자취를 담고 있습니다.*
