# HAProxy 설정 파일 상세 설명 가이드

이 문서는 프로젝트 내의 3가지 HAProxy 설정 파일(`haproxy.cfg`, `haproxy_routing.cfg`, `haproxy_tcp_mode.cfg`)의 주요 옵션들에 대한 설명을 담고 있습니다.

---

## 1. haproxy.cfg (기본 HTTP 로드밸런싱 & 헬스체크)
가장 표준적인 설정으로, 상세한 애플리케이션 상태 확인(Health Check)과 모니터링 기능을 포함합니다.

| 섹션 | 설정값 | 설명 |
| :--- | :--- | :--- |
| **global** | `maxconn 500` | 프로세스당 최대 동시 접속 수를 500개로 제한합니다. |
| **defaults** | `mode http` | Layer 7(HTTP) 모드로 동작하여 HTTP 헤더 분석이 가능합니다. |
| | `timeout connect 10s` | 서버 연결 시도 시 타임아웃 시간입니다. |
| | `timeout client/server 50s` | 클라이언트 및 서버의 세션 유지 타임아웃입니다. |
| **frontend** | `bind *:80` | 클라이언트의 요청을 받을 IP와 포트(80)를 지정합니다. |
| | `default_backend` | 기본적으로 요청을 전달할 서버 그룹을 지정합니다. |
| **backend** | `balance roundrobin` | 서버들에게 순차적으로 요청을 배분합니다. |
| | `option httpchk` | L7 헬스체크를 수행합니다. (예: `GET /status`) |
| | `http-check expect` | 헬스체크 성공 조건(특정 문자열 포함 여부)을 정의합니다. |
| | `server ... check inter` | 각 서버 정의 및 헬스체크 주기(inter)를 설정합니다. |
| **listen stats**| `bind *:83` | 83번 포트를 통해 모니터링 대시보드를 제공합니다. |
| | `stats uri /` | 대시보드 접속 경로를 지정합니다. |

---

## 2. haproxy_routing.cfg (ACL 기반 경로 라우팅)
URL의 경로에 따라 요청을 서로 다른 서버 그룹으로 보내는 'Content Switching' 설정입니다.

*   **ACL (Access Control List)**:
    *   `even_cluster`: URL이 `/even`으로 끝나는 요청을 식별합니다.
    *   `odd_cluster`: URL이 `/odd`으로 끝나는 요청을 식별합니다.
*   **Routing Logic**:
    *   `use_backend ... if ...`: 설정된 ACL 조건이 일치할 때만 특정 백엔드(`even_servers` 또는 `odd_servers`)를 사용합니다.
*   **특징**: 하나의 도메인/IP에서 경로별로 다른 마이크로서비스로 분기 처리할 때 주로 사용됩니다.

---

## 3. haproxy_tcp_mode.cfg (L4 TCP 로드밸런싱)
HTTP 내용을 분석하지 않고 TCP 연결 자체를 전달하는 설정입니다.

*   **`mode tcp`**: 
    *   Layer 4에서 동작하며, HTTP 헤더를 수정하거나 ACL로 분석할 수 없습니다.
    *   오버헤드가 적어 성능이 매우 빠르며, 데이터베이스(MySQL, Redis)나 다른 TCP 기반 프로토콜 로드밸런싱에 적합합니다.
*   **Health Check**: 
    *   단순히 해당 포트가 살아있는지(TCP Three-way handshake 성공 여부)만 확인합니다.

---

## 요약 비교
| 기능 | haproxy.cfg | haproxy_routing.cfg | haproxy_tcp_mode.cfg |
| :--- | :---: | :---: | :---: |
| **작동 계층** | L7 (HTTP) | L7 (HTTP) | L4 (TCP) |
| **주요 목적** | 기본 부하 분산 & 감시 | 경로별 분기 처리 | 단순/고성능 전달 |
| **유연성** | 높음 | 매우 높음 | 낮음 |
| **성능** | 보통 | 보통 | 높음 |
