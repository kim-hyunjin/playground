# HTTP 프로토콜

## HTTP 요청

### 프로토콜 형식

```
method request-uri http-version CRLF
(general|request|entity header CRLF)*
CRLF
message-body
```

- method
  - 서버에 요청하는 명령
  - GET : 서버에 자원을 요청하는 명령어
  - POST : 서버에 자원을 보내는 명령어
  - HEAD : 지정된 자원의 정보(문자집합, 생성일 등)만 요구하는 명령어
  - PUT : 지정한 자원의 변경을 요구하는 명령어
  - DELETE : 지정한 자원의 삭제를 요구하는 명령어
  
- request-uri
  - 서버 자원의 경로:
    예) /board/list
    예) /board/add?title=aaa&content=bbb

- http-version
  - 통신 프로토콜의 버전
    예) HTTP/1.1
  
- header
  - 클라이언트가 서버에 보내는 부가 정보
  - 형식 => '헤더명: 값 CRLF'
  
  - general header : 응답에 모두 사용할 수 있는 부가 정보
    예) Connection: close
        Date: Tue, 15 Nov 1994 08:12:31 GMT
    
  - request header : 요청하는 쪽에서 보낼 수 있는 부가 정보
    예)  Accept: audio/*; q=0.2, audio/basic
         Accept-Language: ko, en-gb;q=0.8, en;q=0.7
         Referer: http://www.w3.org/hypertext/DataSources/Overview.html
         
  - response header : 응답하는 쪽에서 보낼 수 있는 부가 정보
    예) Server: CERN/3.0 libwww/2.17
        Location: http://www.w3.org/pub/WWW/People.html
  
  - entity header : 요청, 응답쪽에서 보내는 데이터에 대한 부가 정보
    예)  Content-Type: text/html; charset=ISO-8859-4
          Content-Language: ko

### HTTP 요청 예
```
GET /tools/refresh_script.html?duration=30&src=%2F%2Fyellow.contentsfeed.com%2FRealMedia%2Fads%2Fadstream_jx.ads%2Fetnews.com%2FMain%40Top HTTP/1.1
Host: www.etnews.com
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36
Sec-Fetch-Dest: iframe
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Referer: https://www.etnews.com/tools/refresh_script.html?duration=30&src=%2F%2Fyellow.contentsfeed.com%2FRealMedia%2Fads%2Fadstream_jx.ads%2Fetnews.com%2FMain%40Top
Accept-Encoding: gzip, deflate, br
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,fil;q=0.6,la;q=0.5
Cookie: PCID=15851059093265315814070; _ga=GA1.2.1502858857.1585105910; _gid=GA1.2.1795053242.1585105910; LLTID=MjIIMzEIMwgyMggyOAgzMAg; LLTIDrefDB=https%253A%252F%252Fwww.google.com%252F; _fbp=fb.1.1585105910125.124333564; LLTIDK=google.com%7C%7C
```

## HTTP 응답

### 프로토콜 형식

```
http-version status-code reason-phase CRLF
(general|request|entity header CRLF)*
CRLF
message-body
```

- status-code
  - 1xx : 요청을 받았고, 처리 중임을 표현
  
  - 2xx : 성공했음을 표현
    200 : 요청을 정상적으로 처리했음
    201 : 요청한 자원을 생성했음
    
  - 3xx : 요청한 자원이 다른 장소로 옮겨졌음을 표현
    301 : 요청한 자원이 다른 장소로 이동했음
    304 : 요쳥한 자원이 변경되지 않았음. 따라서 기존에 다운로드 받은 것을 그대로 사용하라고 요구.
  
  - 4xx : 잘못된 형식으로 요쳥했음을 표현
    401 : 요청 권한이 없음
    403 : 요청한 자원에 대한 권한이 없어 실행을 거절함
    404 : 요청한 자원을 찾을 수 없음
  
  - 5xx : 서버쪽에서 오류가 발생했음을 표현
    500 : 서버에서 프로그램을 실행하다가 오류 발생
    
- message-body
  - 클라이언트가 POST로 요청할 때 message-body 데이터를 서버로 보낸다.
  - 서버에서 응답할 때 message-body 데이터를 클라이언트로 보낸다.
  
### HTTP 응답 예
```
HTTP/1.1 200 OK
Date: Wed, 25 Mar 2020 03:14:19 GMT
Server: Apache
X-Powered-By: PHP/5.6.33
Cache-Control: max-age=0
Expires: Wed, 25 Mar 2020 03:14:19 GMT
Vary: Accept-Encoding,User-Agent
Content-Encoding: gzip
Content-Length: 446
Connection: close
Content-Type: text/html; charset=UTF-8
```



  