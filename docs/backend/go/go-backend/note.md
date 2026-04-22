```
type User struct {
	FirstName string	`json:"first_name"`
	LastName string		`json:"last_name"`
	Email string		`json:"email"`
	CreatedAt time.Time	`json:"created_at"`
}
```

구조체에 `json:"first_name"` 이런식으로 태그를 달아두면 구조체의 변수와 json의 key가 달라서 발생하는 문제를 해결할 수 있다.

## 테스트 컨벤션

- 파일명은 끝에 \_test를 붙인다.
- 메소드명은 Test로 시작한다.
- 아규먼트로 \*testing.T 를 받는다.

### 원활한 테스트를 위한 라이브러리

- github.com/smartystreets/goconvey : 파일이 변경될때마다 자동을 테스트를 수행해준다.
- github.com/stretchr/testify : assert 패키지의 메소드를 사용하면 쉽게 테스트할 수 있다.

## Web socket, Event source

https://developer.mozilla.org/ko/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

https://developer.mozilla.org/ko/docs/Web/API/EventSource

# 3 tier web

Front - Back - DB

# DB 사용하기

- SQLite3

```
go get github.com/mattn/go-sqlite3
```

- 위 라이브러리는 cgo 패키지다. 그래서 c 표준 컴파일러가 필요하다. sqllite3가 c로 만들어져 있기 때문.
- 윈도우의 경우 https://jmeubank.github.io/tdm-gcc/ 여기서 gcc를 다운받으면 된다.

# 배포

- domain 할당
- DNS server(domain과 IP를 매핑해줌)에 내 도메인 등록
- public IP가 필요하다.
  - 웹호스팅 받기(public ip를 할당받은 회사로부터 임대) : 옛날에는 cafe24같은 회사로부터 물리적인 컴퓨터를 임대했다. 오늘날엔 가상화기술의 발달로 하나의 물리 컴퓨터 위에 여러 가상머신을 만든다. 그래서 가상머신을 임대하는 형태로 바뀌었다. => 클라우드 서비스

# heroku
- heroku가 관리하는 container는 ‘dynos’라고 불린다.
- heroku가 컨테이너를 스케일하고, 실행할 때 이미지를 사용하는데 현재 사용 중인 파일 DB는 이미지에 포함되지 않기 때문에 heroku가 자동적으로 이미지를 사용해 가상머신을 바꿀때마다 기존의 파일 DB는 사라지게 된다. ==> heroku가 제공하는 RDBMS를 사용해 해결 가능
