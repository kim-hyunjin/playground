---
title: 컴포넌트 스타일링
date: 2026-04-24
category: Frontend
tags:
  - React
  - CSS
  - Sass
  - CSS-Module
  - styled-components
summary: 일반 CSS부터 Sass, CSS Module, 그리고 CSS-in-JS 방식인 styled-components까지 리액트 컴포넌트를 스타일링하는 다양한 방법들을 알아봅니다.
---

# 컴포넌트 스타일링

리액트 컴포넌트를 스타일링하는 방식은 매우 다양합니다. 대표적인 방식들은 다음과 같습니다.

- **일반 CSS**: 컴포넌트를 스타일링하는 가장 기본적인 방식
- **Sass**: 자주 사용되는 CSS 전처리기 중 하나로, 확장된 CSS 문법을 사용하여 효율적인 작성이 가능합니다.
- **CSS Module**: 스타일 클래스 이름의 중복을 방지하기 위해 파일마다 고유한 이름을 자동 생성해 주는 옵션입니다.
- **styled-components**: 스타일을 자바스크립트 파일에 내장시키는 'CSS-in-JS' 방식입니다.

### 이름 짓는 규칙

클래스 이름에 컴포넌트 이름을 포함시켜 중복을 방지하거나, **BEM 네이밍** 방식(Block, Element, Modifier)을 사용하여 구조를 명확히 할 수 있습니다.

#### CSS Selector

특정 클래스 내부에 있는 요소에만 스타일을 적용할 수 있습니다.

```css
/* .App 안에 들어 있는 .logo에 스타일 적용 */
.App .logo {
  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
}
```

### Sass 사용하기

Sass(Syntactically Awesome Style Sheets)는 코드의 재사용성과 가독성을 높여줍니다. `.scss`와 `.sass` 두 가지 확장자를 지원합니다.

```scss
/* .scss 예시 */
$primary-color: #333;
body {
  color: $primary-color;
}
```

- **라이브러리 불러오기**: `~` 문자를 사용하여 `node_modules`에서 스타일을 불러올 수 있습니다. (`@import '~library/styles';`)

### CSS Module

클래스 이름을 `[파일 이름]_[클래스 이름]_[해시값]` 형태로 자동 생성하여 스타일 충돌을 방지합니다.

```javascript
import styles from './CSSModule.module.css';

const CSSModule = () => {
  return (
    <div className={styles.wrapper}>
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
};
```

- **classnames**: 조건부 스타일링을 편리하게 도와주는 라이브러리입니다.

### styled-components

자바스크립트 파일 내에서 스타일을 정의합니다. **Tagged 템플릿 리터럴** 문법을 사용합니다.

```javascript
import styled from 'styled-components';

const Box = styled.div`
  background: ${props => props.color || 'blue'};
  padding: 1rem;
`;
```

#### Tagged 템플릿 리터럴

템플릿 리터럴에 사용된 내부 값을 온전히 추출하기 위해 함수 뒤에 템플릿 리터럴을 붙여 사용합니다. `styled-components`는 이 방식을 통해 props를 스타일 로직에 전달합니다.
