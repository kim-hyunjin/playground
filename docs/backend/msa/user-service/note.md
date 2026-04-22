## 실행방법
```
$ mvn spring-boot:run -"Dspring-boot.run.jvmArguments='-Dserver.port=900x'"
or 
$ mvn package
$ java -jar -"Dserver.port=900x" .\target\user-service-0.0.1-SNAPSHOT.jar

포트를 지정하지 않으면 무작위 포트 사용(server.port=0으로 설정함)
```

## 로그인 과정
```
AuthenticationFilter
    attemptAuthentication()
        |
        V
UsernamePasswordAuthenticationToken
        |
        V
UserDetailService
    loadUserByUsername() -> UserRepository
                                findByEmail()
        |
        V
AuthenticationFilter
    successfulAuthentication() {
        ...
        Jwt 생성 후 헤더에 넣어줌   
    }
    
```

## JWT 토큰 생성과정
### 전통적인 인증 시스템
```
클라이언트 -> 서버
POST /authenticate
username=...&password=...

서버 -> 클라이언트
HTTP 200 OK
Set-Cookie: sessionId=...

클라이언트 -> 서버
POST,GET /users
Cookie: sessionId=...

서버 -> 클라이언트
HTTP 200 OK
{name: ..., orders: [...]}
```
#### 문제점
- 세션과 쿠키는 모바일 애플리케이션에서 유효하게 사용할 수 없음 (공유 불가)
- 모바일 애플리케이션에서는 웹브라우저 상 HTML 페이지가 아닌 JSON(or XML)과 같은 포멧 필요 

### Token 기반 인증 시스템
```
클라이언트 -> 서버
POST /authenticate
username=...&password=...

서버 -> 클라이언트
HTTP 200 OK
token: JWT(Bearer Token)

클라이언트 -> 서버
POST,GET /users
Authorization: Bearer JWT(Bearer Token)

서버 -> 클라이언트
HTTP 200 OK
{name: ..., orders: [...]}
```
#### JWT (JSON Web Token)
https://jwt.io
- 인증 헤더 내에서 사용되는 토큰 포맷
- 두 개의 상이한 시스템끼리 안전한 방법으로 통신 가능

#### 장점
- 클라이언트 독립적인 서비스를 만들 수 있다(stateless)
- CDN의 혜택을 받을 수 있다.
- No Cookie-Session (NO CSRF, 사이트간 요청 위조)
- 지속적인 토큰 저장