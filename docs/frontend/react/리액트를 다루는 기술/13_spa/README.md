# SPA
기존에는 사용자가 다른 페이지로 이동할 때마다 새로운 html을 받아 오고, 페이지를 로딩할 때마다 서버에서 리소스를 전달받아 해석한 뒤 화면에 보여줬다.<br/>

화면에 보여 주어야 할 정보가 많은 경우, 새로운 화면을 보여 주어야 할 때마다 서버 측에서 모든 뷰를 준비하는데 성능상의 문제가 발생할 수 있다.<br>

리액트는 뷰 렌더링을 사용자의 브라우저가 담당하도록 하고, 사용자와 인터랙션이 발생하면 필요한 부분만 자바스크립트를 사용해 업데이트 해준다.<br/>

새로운 데이터가 필요하다면 서버 API를 호출하여 필요한 데이터만 새로 불러와 사용할 수도 있다.

### 라우팅
싱글 페이지라고 해서 화면이 한 종류인 것은 아니다. 서버에서 사용자에게 제공하는 페이지는 한 종류이지만, 해당 페이지에서 로딩된 자바스크립트와 현재 사용자 브라우저의 주소 상태에 따라 다양한 화면을 보여줄 수 있다.

다른 주소에 다른 화면을 보여주는 것을 라우팅이라고 한다.

### 단점
- 앱의 규모가 커지면 자바스크립트 파일이 너무 커진다는 단점이 있다. 페이지 로딩 시 사용자가 실제로 방문하지 않을 수도 있는 페이지의 스크립트도 불러온다. => 코드 스플리팅을 사용해 라우트별로 파일을 나누어 트래픽과 로딩 속도를 개선할 수 있다.
- 검색 엔진의 검색 결과에 페이지가 잘 나타나지 않을 수 있다. => 서버 사이드 렌더링을 통해 해결 가능.

### 라우터 적용하기
```
yarn add react-router-dom
```
react-router-dom에 내장되어 있는 BrowserRouter 컴포넌트는 웹 애플리케이션에 HTML5의 History API를 사용하여 페이지를 새로고침하지 않고도 주소를 변경하고, 현재 주소에 관련된 정보를 props로 쉽게 조회하거나 사용할 수 있도록 해준다.

```
<Route path="주소 규칙" component={보여 줄 컴포넌트} />
<Route path="주소 규칙" component={보여 줄 컴포넌트} exact={true|false} />
```

### Link 컴포넌트 사용하여 다른 주소로 이동하기
Link 컴포넌트는 클릭하면 다른 주소로 이동시켜 주는 컴포넌트이다.<br/>
일반 웹 애플리케이션에서는 a 태그를 사용하여 페이지를 전환하는데 리액트 라우터를 사용할 때는 이 태그를 직접 사용하면 안 된다.<br/>
a태그는 페이지를 전환하는 과정에서 페이지를 새로 불러오기 때문에 애플리케이션이 들고 있던 상태들을 모두 날려 버리게 된다.<br/>
Link 컴포넌트를 사용하여 페이지를 전환하면, 페이지를 새로 불러오지 않고 애플리케이션은 그대로 유지한 상태에서 HTML5 History API를 사용하여 페이지의 주소만 변경해준다.<br/>
Link 컴포넌트 자체는 a태그로 이루어져 있지만, 페이지 전환을 방지하는 기능이 내장되어 있다.
```
<Link to="주소">내용</Link>
```

### URL 파라미터와 쿼리
```
파라미터
/profiles/somebody

쿼리
/about?details=true
```

URL 파라미터를 사용할 때는 라우트로 사용되는 컴포넌트에서 받아오는 match라는 객체 안의 params 값을 참조한다.
```
<Route path="/profile/:username" component={Profile} />

const Profile = ({match}) => {
  const {username} = match.params;
  ...
}
```

쿼리는 location 객체 안 search 값에서 조회할 수 있다.
```
location의 형태
{
  "pathname": "/about",
  "search": "?detail=true",
  "hash": ""
}
```
쿼리 문자열을 객체로 변환할 때는 qs라는 라이브러리를 사용한다.
```
yarn add qs
```
쿼리를 사용할 때는 쿼리 문자열을 객체로 파싱하는 과정에서 결과 값은 언제나 문자열이다.

### 서브 라우트
서브 라우트는 라우트 내부에 또 라우트를 정의하는 것을 말한다.

### history
history 객체는 라우트로 사용된 컴포넌트에 match, location과 함께 전달된다. 이 객체를 통해 라우터 API를 호출할 수 있다.

### withRouter
withRouter 함수는 HoC(Higher-order Component)다. 라우트로 사용된 컴포넌트가 아니어도 match, location, history 객체를 접근할 수 있게 해준다.
```
import React from 'react';
import {withRouter} from 'react-router-dom';

const WithRouterSample = ({location, match, history}) => {
  return (
    <div>
      <h4>location</h4>
      <textarea
        value={JSON.stringify(location, null, 2)}
        rows={7}
        readOnly={true}
      />
      <h4>match</h4>
      <textarea 
        value={JSON.stringify(match, null, 2)}
        rows={7}
        readOnly={true}
      />
      <button onClick={() => history.push('/')}>홈으로</button>
    </div>
  );
};

export default withRouter(WithRouterSample);
```
withRouter를 사용할 때는 컴포넌트를 내보낼 때 함수로 감싸준다.<br/>
JSON.stringify의 두 번째, 세 번째 파라미터를 위와 같이 null, 2로 설정하면 JSON에 들여쓰기가 적용된 상태로 문자열이 만들어진다.

### Switch
Switch 컴포넌트는 여러 Route를 감싸서 그 중 일치라는 단 하나의 라우트만을 렌더링 시켜준다. 모든 규칙과 일치하지 않을 때 보여줄 Not Found 페이지도 구현할 수 있다.

### NavLink
NavLink는 Link와 비슷하다. 사용하는 경로가 일치하는 경우 특정 스타일 혹은 CSS 클래스를 적용할 수 있는 컴포넌트다.
- 링크가 활성화되었을 때 스타일을 적용할 때는 activeStyle
- CSS클래스를 적용할 때는 activeClassName 값을 props로 넣어주면된다.

### 정리
- 리액트 라우터를 사용하여 주소 경로에 따라 다양한 페이지를 보여줄 수 있다.
- 큰 규모의 프로젝트를 진행하다 보면 문제가 발생한다. => 웹 브라우저에 사용할 컴포넌트, 상태 관리 로직 등 함수들이 쌓여 자바스크립트 파일의 크기가 매우 커진다.