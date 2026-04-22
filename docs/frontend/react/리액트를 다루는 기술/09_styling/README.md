# 컴포넌트 스타일링
- 일반 CSS : 컴포넌트를 스타일링하는 가장 기본적인 방식
- Sass : 자주 사용되는 CSS 전처리기 중 하나. 확장된 CSS문법을 사용하여 CSS코드를 더욱 쉽게 작성할 수 있도록 해준다.
- CSS Module : 스타일을 작성할 때 CSS 클래스가 다른 CSS 클래스의 이름과 절대 충돌하지 않도록 파일마다 고유한 이름으로 자동 생성해주는 옵션.
- styled-components : 스타일을 자바스크립트 파일에 내장시키는 방식.

### 이름 짓는 규칙
클래스 이름에 컴포넌트 이름을 포함시킴으로써 다른 컴포넌트에서 실수로 중복되는 클래스를 만들어 사용하는 것을 방지할 수 있다.<br/>
비슷한 방식으로 BEM 네이밍 방식도 있다. 이름을 지을 때 일종의 규칙을 준수하여 해당 클래스가 어디에서 어떤 용도로 사용되는지 명확하게 작성하는 방식.

#### CSS Selector
CSS클래스가 특정 클래스 내부에 있는 경우에만 스타일을 적용할 수 있다.
```
예) .App 안에 들어 있는 .logo에 스타일 적용
.App .logo {
  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
}
```
컴포넌트의 최상위 html 요소에는 컴포넌트의 이름으로 클래스 이름을 짓고(.App), 그 내부에서는 소문자를 입력하거나(.logo), header 같은 태그를 사용하여 클래스 이름이 불필요한 경우에는 아예 생략할 수도 있다.

### Sass 사용하기
Sass(Syntactically Awesome Style Sheets)는 CSS 전처리기로 복잡한 작업을 쉽게 할 수 있도록 해주고, 스타일 코드의 재활용성을 높여 줄 뿐만 아니라 코드의 가독성을 높여 유지보수를 더욱 쉽게 해준다.
- Sass에서는 확장자 .scss와 .sass를 지원한다.
```
.sass
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
  font: 100% $font-stack
  color: $primary-color
```
```
.scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
.sass와 .scss는 {}와 ;의 유무만 다르다.
```
yarn add node-sass
```

#### sass-loader 설정 커스터마이징하기
1. 먼저 git commit 후 yarn eject로 숨겨진 세부 설정을 꺼낸다.
2. 생성된 config 디렉토리에서 webpack.config.js를 연다.
3. sassRegex부분을 찾아 use: 에 있는 'sass-loader' 부분을 지우고, concat을 통해 커스터마이징된 sass-loader 설정을 넣는다.

#### node_modules에서 라이브러리 불러오기
```
@import '~library/styles';
물결 문자를 사용하면 자동으로 node_modules에서 라이브러리 디렉터리를 탐지하여 스타일을 불러올 수 있다.
```

### CSS Module
CSS를 불러와서 사용할 때 클래스 이름을 고유한 값, [파일 이름]_[클래스이름]_[해시값] 형태로 자동으로 만들어서 컴포넌트 스타일 클래스 이름이 중첩되는 현상을 방지해 주는 기술.<br/>
```
CSSModule.module.css

.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

/* 글로벌 CSS를 작성하고 싷다면 */
:global .something {
  font-weight: 800;
  color: aqua;
}
```
```
import styles from './CSSModule.module.css';

const CSSModule = () => {
  return (
    <div className={styles.wrapper}>
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  )
};
```
```
$ console.log(styles);
> {wrapper: "CSSModule_wrapper__1F2tc"}

이 고유한 클래스 이름을 사용하려면 JSX 엘리먼트에
className={styles.[클래스이름]} 형태도 전달해주면 된다.
:global을 사용해 전역으로 선언한 클래스의 경우 문자열로 넣어주면 된다.
```
```
두 개 이상 적용할 때
    <div className={`${styles.wrapper} ${styles.inverted}`}>
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>

`${}` - ES6문법 템플릿 리터럴 사용.
```

#### classnames
classnames는 CSS 클래스를 조건부로 설정할 때 매우 유용한 라이브러리이다.
```
yarn add classnames
```
```
ex)
const MyComponent = ({highlighted, theme}) => (
  <div className={classNames('MyComponent', {highlighted}, theme)}>Hello</div>
);

// highlighted 값이 true이면 highlighted 클래스가 적용되고, false이면 적용되지 않는다. 아래와 같다.

const MyComponent = ({highlighted, theme}) => (
  <div className={`MyComponent ${highlighted? 'highlighted' : ''}, ${theme}`}>Hello</div>
);
```
```
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

<div className={cx('wrapper', 'inverted')}>
  안녕하세요, 저는 <span className="something">CSS Module!</span>
</div>
```

#### Sass와 함께 사용하기
Sass를 사용할 때도 .module.scss 확장자를 사용해주면 CSS Module로 사용할 수 있다.

#### CSS Module이 아닌 파일에서 CSS Module 사용하기
일반 .css/scss 파일에서 :local을 사용해 CSS Module을 사용할 수 있다.

### styled-components
'CSS-in-JS'방식. 자바스크립트 파일에 스타일까지 작성할 수 있기 때문에 .css나 .scss 파일을 따로 만들지 않아도 된다.
```
yarn add styled-components
```
- styled-components를 사용하면 props에 전달해 주는 값을 쉽게 스타일에 적용할 수 있다는 것이다.

### Tagged 템플릿 리터럴
앞에서 `를 사용해 만든 문자열에 스타일 정보를 넣어주었다. -> Tagged 템플릿 리터럴
```

`hello ${ {foo: 'bar'} } ${() => 'world'}!`
>> "hello [object Object] () => 'world'!"

```

```
다음과 같이 함수를 작성하고 나서 해당 함수 뒤에 템플릿 리터럴을 넣어주면 템플릿 안에 넣은 값을 온전히 추출할 수 있다.

function tagged(...args) {
  console.log(args);
}

tagged`hello ${ {foo: 'bar'} } ${() => 'world'}!`
>> (3) [Array(3), {...}, f]
    0: (3) ["hello ", " ", "!", raw: Array(3)]
    1: {foo: "bar"}
    2: () => 'world'
```

```
// 태그의 타입을 styled 함수의 인자로 전달할 수 있다.
const MyInput = styled('input')`background: gray;`
const MyInput = styled(Link)`color: blue;` // => 컴포넌트를 파라미터로 넣는 경우, 그 컴포넌트에서 className props가 최상위 DOM className 값으로 설정되어 있어야 한다.
```

#### 스타일에서 props 조회하기
```
const Box = styled.div`
  background: ${props => props.color || 'blue'};
  padding: 1rem;
  display: flex;
`;
```