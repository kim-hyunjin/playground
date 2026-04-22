# 분산 시스템 설계의 핵심: 가용성과 확장성을 위한 기술들

본 프로젝트는 단일 서버의 한계를 넘어 대규모 트래픽을 처리하고 시스템의 가용성을 높이기 위한 **분산 시스템(Distributed System)**의 핵심 기술들을 실습하고 정리한 공간입니다.

---

## ⚖️ 1. 부하 분산 (Load Balancing)

서버 한 대에 가해지는 부하를 여러 대의 서버로 분산하여 시스템의 전체적인 성능과 안정성을 높이는 기술입니다.

### HAProxy를 활용한 L7 로드 밸런싱 예시
`haproxy.cfg` 설정을 통해 HTTP 요청의 경로(Path)나 호스트에 따라 적절한 백엔드 서버로 라우팅할 수 있습니다.

```haproxy
# backend/distributed-system/load-balancing/haproxy-practice/haproxy/haproxy_routing.cfg
frontend http_front
    bind *:80
    mode http

    # URL 경로에 따른 ACL 설정
    acl url_api path_beg /api
    acl url_web path_beg /web

    # ACL 조건에 따른 백엔드 할당
    use_backend api_servers if url_api
    use_backend web_servers if url_web
    default_backend default_servers

backend api_servers
    mode http
    balance roundrobin
    server api1 10.0.0.1:8080 check
    server api2 10.0.0.2:8080 check

backend web_servers
    mode http
    balance leastconn
    server web1 10.0.0.3:80 check
```
- **Round Robin:** 서버에 순차적으로 요청을 배분합니다.
- **Least Connections:** 현재 연결 수가 가장 적은 서버로 요청을 보냅니다.

---

## 🗄️ 2. 데이터베이스 샤딩 (Sharding)

데이터가 너무 커져서 단일 DB 서버에 저장할 수 없을 때, 데이터를 여러 서버로 나누어 저장하는 기법입니다.

### 일관적 해싱 (Consistent Hashing)
서버의 추가나 삭제 시 데이터의 재배치를 최소화하기 위해 사용되는 알고리즘입니다. 
- 해시 링(Hash Ring) 구조를 사용하여 데이터와 서버를 매핑합니다.
- 서버가 추가되어도 링 위의 특정 구간 데이터만 이동하면 되므로 시스템 부하를 줄일 수 있습니다.

---

## ✉️ 3. 메시지 브로커 (Message Broker)

서비스 간의 결합도를 낮추고 비동기 처리를 가능하게 하기 위해 사용됩니다. (예: Apache Kafka, RabbitMQ)

- **비동기 처리:** 주문 완료 후 메일 발송과 같은 작업을 즉시 처리하지 않고 큐에 넣어 나중에 처리합니다.
- **완충 작용 (Buffering):** 갑작스러운 트래픽 폭증 시 메시지 브로커가 이를 수용하여 백엔드 서비스의 장애를 방지합니다.

---

## 🛠 실습 디렉토리 안내
- [**Load Balancing**](./load-balancing): HAProxy 설정 및 알고리즘 학습
- [**Service Registry**](./service-registry): 분산 환경에서의 서비스 발견 패턴
- [**Sharding**](./sharding): 일관적 해싱과 데이터 분산 전략
- [**Message Broker**](./message-broker): 카프카와 메시징 시스템 개요

---
*본 가이드는 분산 시스템의 아키텍처적 완성도를 높이기 위한 주요 개념과 실습 코드를 포함하고 있습니다.*
