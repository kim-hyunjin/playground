# Zipkin?

https://zipkin.io/

- Twitter에서 사용하는 분산 환겨의 Timing 데이터 수집, 추적 시스템 (오픈소스)
- 분산환경에서 시스템 병목 현상을 파악하는데 사용할 수 있다.
- Collector, Query Service, Database WebUI로 구성된다.

## Span

- 하나의 요청에 사용되는 작업의 단위.
- 64bit unique ID

## Trace

- Span의 세트. 트리 구조로 이루어진다.
- 하나의 요청에 같은 Trace ID를 사용한다.

# docker로 설치하기

```
docker run -d -p 9411:9411 openzipkin/zipkin
```

# jar로 설치하기

```
curl -sSL https://zipkin.io/quickstart.sh | bash -s
java -jar zipkin.jar
```

# 설치확인

```
http:localhost:9411/zipkin
```
