# 📚 블로그 구축 및 콘텐츠 생성 작업 목록 (TODO)

본 저장소의 프로젝트들을 분석하여 MkDocs 블로그용 고품질 콘텐츠를 생성하고 배포하는 여정을 기록합니다.

---

## 🛠 Phase 1: 콘텐츠 생성 (Blog Post Authoring)
각 프로젝트의 소스코드를 분석하여 풍부한 설명이 담긴 `README.md` 또는 `post.md`를 생성합니다.

### 🏢 Backend (백엔드)
- [x] **Spring Cloud MSA** (`backend/msa`): 아키텍처 다이어그램 및 서비스 설명 추가
- [x] **Distributed System** (`backend/distributed-system`): 샤딩, 로드밸런싱, 메시지 브로커 핵심 정리
- [x] **Database Engineering** (`backend/database-engineering`): 
    - [x] **SQL Tuning Case Studies**: 20+ real-world optimization examples
    - [x] **Database Internals**: Storage, Indexing (B-Tree/LSM), ACID, MVCC
    - [x] **Advanced Architectures**: Sharding, Replication, Partitioning
- [x] **Backend Engineering** (`backend/backend-engineering`):
    - [x] **Communication Protocols**: TCP, UDP, HTTP/1.1~3, gRPC, WebRTC
    - [x] **Request Journey**: Accept -> Read -> Decrypt -> Parse -> Process
    - [x] **Message Brokers**: RabbitMQ Push API, Kafka Long Polling
- [x] **Performance Test** (`backend/performance-test`): Artillery를 이용한 부하 테스트 및 결과 분석
- [x] **NestJS Slack Clone** (`backend/nestjs/slack-clone`): 대규모 앱 구조 및 실시간 통신 분석
- [x] **Node.js Zoom Clone** (`backend/nodejs/zoom-clone`): WebRTC와 WebSocket 활용법 정리
- [x] **Django Airbnb Clone** (`backend/django/airbnb-rest`): RESTful API 설계 및 실습 정리
- [x] **Go Backend** (`backend/go/go-backend`): Go 언어의 동시성을 활용한 백엔드 구조 정리

### 🤖 AI / Deep Learning (인공지능)
- [x] **Deep Learning from Scratch** (`ai/deeplearning-from-scratch`): 바닥부터 구현하는 신경망 핵심 요약
- [x] **LangChain** (`ai/langchain`): LLM 애플리케이션 구축 패턴 정리

### 🧮 Algorithms (알고리즘)
- [x] **Grind 75 / LeetCode** (`algorithms/`): 주요 문제군(Array, Tree, DP 등)별 해결 전략 포스팅

### 🎨 Frontend (프런트엔드)
- [x] **Next.js Projects** (`frontend/nextjs/`): SSR/SSG 활용 사례 및 프로젝트 분석
- [x] **React / Twitter Clone** (`frontend/react/twitter-clone`): 상태 관리 및 컴포넌트 설계 정리
- [x] **WebRTC** (`frontend/webrtc`): 실시간 미디어 스트리밍 기초 정리

### 🔡 Language (언어 별 기초)
- [x] **Go, Kotlin, Rust, Java**: 각 언어별 핵심 문법 및 학습 노트 정리

### 🔗 Blockchain (블록체인)
- [x] **DApp Development** (`blockchain/lottery-dapp`): 스마트 컨트랙트 및 Next.js 연동 실습 정리

### 📱 Mobile (모바일)
- [x] **Flutter / React Native**: 크로스 플랫폼 앱 개발 프로젝트 분석
- [x] **Android / iOS**: 네이티브 앱 개발 학습 노트 정리

### 🏗 Design & Architecture (설계)
- [x] **Design Patterns** (`design-architecture/design-pattern-and-refactoring`): 주요 디자인 패턴의 개념과 실습 코드 정리

### 🛡 Hacking (보안)
- [x] **Backdoor Study** (`hacking/backdoor`): 보안 취약점 분석 및 대응 방안 정리

---

## 🚀 Phase 2: 블로그 시스템 구축 (MkDocs)
- [x] `requirements.txt` 생성 (mkdocs-material, mkdocs-jupyter 등)
- [x] `mkdocs.yml` 설정 (테마, 내비게이션, 플러그인 구성)
- [x] GitHub Actions 자동 배포 워크플로우 (`.github/workflows/gh-pages.yml`) 작성
- [x] GitHub Pages 도메인 연결 및 최종 확인

---

## 📝 New Blog Ideas (Suggested by Blog Creator)
분석된 프로젝트 자산을 바탕으로 추천된 블로그 글감 목록입니다.

- [x] **바닥부터 시작하는 딥러닝 핵심 요약** (`ai/deeplearning-from-scratch/README.md` 분석)
- [x] **디자인 패턴의 정석: 실무 적용 가이드** (`design-architecture/design-pattern-and-refactoring/note/디자인 패턴/디자인패턴.md` 분석)
- [x] **코드의 구린내(Code Smell)와 리팩토링 전략** (`design-architecture/design-pattern-and-refactoring/note/리팩토링/코드의 구린내.md` 분석)
- [x] **자연어 처리(NLP)와 단어 임베딩의 이해** (`ai/deeplearning-master/ch17 자연어 처리와 단어 임베딩.ipynb` 분석)
- [x] **순환 신경망(RNN)으로 시퀀스 데이터 다루기** (`ai/deeplearning-master/ch18 시퀀스 배열로 다루는 순환 신경망 RNN.ipynb` 분석)
- [x] **머신러닝 알고리즘 TOP 10 총정리** (`ai/deeplearning-master/가장 많이 쓰이는 머신 러닝 알고리즘 TOP 10.ipynb` 분석)
- [x] **효율적인 문제 해결을 위한 사고 과정** (`algorithms/note/문제 해결 개관.md` 분석)
- [x] **SOLID를 넘어선 유연한 설계 원칙** (`design-architecture/design-pattern-and-refactoring/note/디자인 패턴/디자인 원칙.md` 분석)
- [x] **딥러닝 모델 설계와 데이터 전처리 파이프라인** (`ai/deeplearning-master/ch10 딥러닝 모델 설계하기.ipynb` 분석)
- [x] **딥러닝을 위한 선형 회귀와 로지스틱 회귀 모델** (`ai/deeplearning-master/ch06 로지스틱 회귀 모델.ipynb` 분석)

---

## 💡 참고 사항
- 각 포스트는 소스코드 분석을 통해 **구현 배경, 핵심 코드 snippet, 배운 점**을 포함하도록 함.
- Mermaid 다이어그램을 적극 활용하여 아키텍처를 시각화함.
- Jupyter Notebook (`.ipynb`) 파일은 `mkdocs-jupyter`를 통해 직접 노출함.
