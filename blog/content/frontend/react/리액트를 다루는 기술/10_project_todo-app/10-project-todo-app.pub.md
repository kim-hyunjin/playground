---
title: Todo 앱 만들기
date: 2026-04-24
category: Frontend
tags:
  - React
  - project
  - Todo-app
  - react-icons
summary: 리액트의 기본적인 기능을 활용하여 실전 프로젝트인 Todo 앱을 구축하며 프로젝트 구조와 아이콘 사용법을 익힙니다.
---

# Todo app 만들기

실전 프로젝트를 통해 리액트의 기초를 다집니다.

### 필요한 라이브러리 설치

```bash
yarn add node-sass classnames react-icons
```

- **react-icons**: [React Icons 공식 문서](https://react-icons.github.io/react-icons/)에서 다양한 아이콘 세트를 찾아 사용할 수 있습니다.

### 컴포넌트 구성 요소

- **TodoTemplate**: 앱의 타이틀과 콘텐츠를 감싸는 레이아웃 컴포넌트입니다.
- **TodoInsert**: 새로운 항목을 입력하는 컴포넌트입니다.
- **TodoList**: `todos` 배열을 받아 여러 개의 `TodoListItem`을 렌더링합니다.
- **TodoListItem**: 각 할 일 항목에 대한 정보를 보여주는 컴포넌트입니다.

### 성능 최적화 팁

함수로 전달해야 할 이벤트 핸들러를 만들 때는 `useCallback`으로 감싸는 것을 습관화하는 것이 좋습니다. 이는 컴포넌트가 리렌더링될 때마다 함수가 새로 생성되는 것을 방지하여 성능을 향상시킵니다.
