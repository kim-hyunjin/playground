# note

## what is an API

REST api, brower api, twitter api, ...

    application, program, service or machine 등과 상호작용할 수 있는 방법

## what is REST?

URL을 통해 상호작용하는 api

- example

      example.com/api/movies
      example.com/api/movies/1
      example.com/api/search?rating=9

### with HTTP method

어떤 URL에 어떤 행위를 할 것인지 명시적으로 표현

- [methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- example

      GET example.com/api/movies
      POST example.com/api/movies
      PUT example.com/api/movies/1

  [twitter api link](https://developer.twitter.com/en/docs/api-reference-index)

### REST api가 가진 문제

- over-fetching: API로부터 필요한 데이터보다 많은 데이터를 받는 문제(불필요한 자원 낭비 유발, data 전송 속도 감소)
- under-fetching: API로부터 필요한 데이터보다 더 적은 데이터를 받는 문제(필요한 데이터를 가져오기 위한 추가 API 호출 필요, 추가 자원 소모 필요, 필요한 데이터를 모두 모으는 데까지 시간 소모)

## welcome to graphql

graphql은 over-fetching, under-fetching을 해결. 한번의 request로 필요한 데이터를 모두 얻을 수 있기 때문에 빠르게 데이터를 보여줄 수 있다.

[try graphql](https://graphql.org/swapi-graphql)
