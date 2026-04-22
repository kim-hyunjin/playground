# IP / TCP / UDP / TLS

---

## 1. Internet Protocol (IP)

### 1.1 IP란?

- 네트워크 계층(Layer 3) 프로토콜
- 데이터를 **패킷** 단위로 전송
- 각 호스트를 **IP 주소**로 식별

### 1.2 IP Packet 구조

IP 패킷은 **Header**와 **Data(Payload)** 로 구성된다.

#### IPv4 Header (20~60 bytes)

| 필드 | 크기 | 설명 |
|------|------|------|
| Version | 4 bit | IP 버전 (IPv4 = 4) |
| IHL (Internet Header Length) | 4 bit | 헤더 길이 (단위: 32-bit words) |
| Total Length | 16 bit | 패킷 전체 길이 (헤더 + 데이터) |
| Identification | 16 bit | 단편화된 패킷 식별 |
| Flags | 3 bit | 단편화 제어 (DF, MF) |
| Fragment Offset | 13 bit | 단편화 위치 |
| TTL (Time To Live) | 8 bit | 라우터 홉 수 제한, 홉마다 1씩 감소 |
| Protocol | 8 bit | 상위 프로토콜 (TCP=6, UDP=17, ICMP=1) |
| Header Checksum | 16 bit | 헤더 오류 검출 |
| Source IP Address | 32 bit | 출발지 IP |
| Destination IP Address | 32 bit | 목적지 IP |
| Options | 가변 | 선택적 옵션 필드 |

### 1.3 IP의 특징

- **비연결형(Connectionless)**: 사전 연결 설정 없이 패킷 전송
- **비신뢰성(Unreliable)**: 패킷 전달 보장 없음 (손실·순서 뒤바뀜 가능)
- **최선형 전달(Best-Effort Delivery)**: 전달을 위해 최선을 다하지만 보장하지 않음

---

## 2. ICMP (Internet Control Message Protocol)

### 2.1 ICMP란?

- IP 위에서 동작하는 **네트워크 진단·오류 보고** 프로토콜
- IP 패킷의 Protocol 필드 = 1

### 2.2 주요 ICMP 메시지 타입

| 타입 | 이름 | 설명 |
|------|------|------|
| 0 | Echo Reply | Ping 응답 |
| 3 | Destination Unreachable | 목적지 도달 불가 |
| 8 | Echo Request | Ping 요청 |
| 11 | Time Exceeded | TTL 만료 |

### 2.3 Ping

- **Echo Request**(Type 8)를 보내고 **Echo Reply**(Type 0)를 받아 연결 상태 확인
- RTT(Round Trip Time) 측정 가능

### 2.4 Traceroute

- TTL을 1부터 점진적으로 증가시키며 전송
- 각 라우터에서 TTL 만료 시 **Time Exceeded**(Type 11) 메시지 반환
- 이를 통해 **경로상의 각 라우터(홉)** 를 추적

---

## 3. ARP (Address Resolution Protocol)

### 3.1 ARP란?

- **IP 주소 → MAC 주소** 변환 프로토콜
- 같은 네트워크(LAN) 내에서 동작

### 3.2 ARP 동작 과정

1. 호스트 A가 목적지 IP에 대한 MAC 주소를 모름
2. **ARP Request** 를 브로드캐스트 (FF:FF:FF:FF:FF:FF)로 전송
3. 해당 IP를 가진 호스트 B가 **ARP Reply** (유니캐스트)로 자신의 MAC 주소 응답
4. 호스트 A가 **ARP Cache(Table)** 에 결과 저장

### 3.3 ARP Cache

- IP-MAC 매핑을 일정 시간 캐시
- 캐시 만료 후 다시 ARP Request 수행

---

## 4. IP Addressing

### 4.1 IPv4 주소

- 32비트, **dotted decimal** 표기 (예: 192.168.1.1)
- **Network 부분** + **Host 부분** 으로 구성

### 4.2 서브넷 마스크 (Subnet Mask)

- 네트워크 부분과 호스트 부분을 구분
- 예: 255.255.255.0 → 상위 24비트가 네트워크

### 4.3 CIDR (Classless Inter-Domain Routing)

- 클래스 기반 주소 체계의 한계를 극복
- **슬래시 표기법**: 192.168.1.0/24
- /24 = 상위 24비트가 네트워크 프리픽스

### 4.4 서브넷팅 (Subnetting)

- 하나의 네트워크를 더 작은 서브넷으로 분할
- 호스트 비트 일부를 서브넷 비트로 사용
- 예: /24 → /26 으로 분할하면 4개의 서브넷 생성 (각 62개 호스트)

### 4.5 특수 주소

| 주소 | 용도 |
|------|------|
| 127.0.0.1 | Loopback (자기 자신) |
| 0.0.0.0 | 기본 경로 / 모든 인터페이스 |
| 255.255.255.255 | 브로드캐스트 |
| 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | 사설 IP 대역 |

---

## 5. NAT (Network Address Translation)

### 5.1 NAT란?

- **사설 IP ↔ 공인 IP** 변환
- 라우터/게이트웨이에서 수행
- IPv4 주소 부족 문제 완화

### 5.2 NAT 동작

1. 내부 호스트(사설 IP)가 외부로 패킷 전송
2. NAT 장비가 **Source IP**를 공인 IP로 변환 + 포트 매핑
3. 외부 응답이 돌아오면 NAT 테이블을 참조하여 원래 사설 IP로 역변환

### 5.3 NAT의 종류

- **Static NAT**: 1:1 매핑 (사설 IP ↔ 공인 IP 고정)
- **Dynamic NAT**: 공인 IP 풀에서 동적 할당
- **PAT (Port Address Translation)**: 하나의 공인 IP에 포트 번호로 다수 호스트 구분 (가장 일반적)

### 5.4 NAT의 한계

- End-to-End 연결 모델 훼손
- P2P 통신 어려움
- NAT 테이블 유지 오버헤드

---

## 6. UDP (User Datagram Protocol)

### 6.1 UDP란?

- 전송 계층(Layer 4) 프로토콜
- **비연결형(Connectionless)**, **비신뢰성(Unreliable)**
- 오버헤드가 적고 빠름

### 6.2 UDP Header (8 bytes)

| 필드 | 크기 | 설명 |
|------|------|------|
| Source Port | 16 bit | 출발지 포트 |
| Destination Port | 16 bit | 목적지 포트 |
| Length | 16 bit | UDP 헤더 + 데이터 전체 길이 |
| Checksum | 16 bit | 오류 검출 (선택적) |

### 6.3 UDP의 특징

- **핸드셰이크 없음**: 바로 데이터 전송
- **순서 보장 없음**: 패킷 도착 순서 보장하지 않음
- **흐름 제어 / 혼잡 제어 없음**
- **작은 헤더 (8 bytes)**: TCP(20 bytes)에 비해 오버헤드 적음

### 6.4 UDP Multiplexing / Demultiplexing

- **포트 번호**를 사용하여 여러 애플리케이션의 데이터를 구분
- Multiplexing: 여러 소켓의 데이터를 하나의 UDP 세그먼트로 묶어 전송
- Demultiplexing: 수신 측에서 목적지 포트 번호를 보고 해당 소켓으로 전달

### 6.5 UDP 사용 사례

- DNS 질의
- 스트리밍 (영상·음성)
- 온라인 게임
- DHCP
- IoT / 실시간 애플리케이션

---

## 7. TCP (Transmission Control Protocol)

### 7.1 TCP란?

- 전송 계층(Layer 4) 프로토콜
- **연결 지향(Connection-Oriented)**
- **신뢰성 있는 데이터 전송** 보장

### 7.2 TCP Header (20~60 bytes)

| 필드 | 크기 | 설명 |
|------|------|------|
| Source Port | 16 bit | 출발지 포트 |
| Destination Port | 16 bit | 목적지 포트 |
| Sequence Number | 32 bit | 바이트 스트림 내 순서 번호 |
| Acknowledgment Number | 32 bit | 다음에 받기를 기대하는 바이트 번호 |
| Data Offset (Header Length) | 4 bit | TCP 헤더 길이 |
| Flags (Control Bits) | 각 1 bit | SYN, ACK, FIN, RST, PSH, URG 등 |
| Window Size | 16 bit | 수신 윈도우 크기 (흐름 제어) |
| Checksum | 16 bit | 오류 검출 |
| Urgent Pointer | 16 bit | 긴급 데이터 위치 |
| Options | 가변 | MSS, Window Scaling, Timestamps 등 |

### 7.3 TCP 3-Way Handshake (연결 수립)

```
Client                    Server
  |                          |
  |--- SYN (seq=x) -------->|
  |                          |
  |<-- SYN+ACK (seq=y,      |
  |    ack=x+1) ------------|
  |                          |
  |--- ACK (ack=y+1) ------>|
  |                          |
  |    [Connection Established]
```

1. **SYN**: 클라이언트가 초기 시퀀스 번호(ISN)와 함께 연결 요청
2. **SYN+ACK**: 서버가 클라이언트의 SYN 확인 + 자신의 ISN 전송
3. **ACK**: 클라이언트가 서버의 SYN 확인 → 연결 완료

### 7.4 TCP 4-Way Handshake (연결 종료)

```
Client                    Server
  |                          |
  |--- FIN ----------------->|
  |                          |
  |<-- ACK -----------------|
  |                          |
  |<-- FIN -----------------|
  |                          |
  |--- ACK ----------------->|
  |                          |
  |    [Connection Closed]
```

1. **FIN**: 한쪽이 연결 종료 요청
2. **ACK**: 상대방이 FIN 수신 확인
3. **FIN**: 상대방도 연결 종료 요청
4. **ACK**: FIN 수신 확인 → 연결 종료

### 7.5 TCP Segment

- TCP는 데이터를 **세그먼트(Segment)** 단위로 전송
- **MSS (Maximum Segment Size)**: 하나의 세그먼트에 담을 수 있는 최대 데이터 크기
- MTU(Maximum Transmission Unit)에 의해 결정됨: MSS = MTU - IP Header - TCP Header

### 7.6 TCP 신뢰성 메커니즘

#### Sequence Number & Acknowledgment

- **Sequence Number**: 전송하는 데이터의 바이트 단위 순서 번호
- **Acknowledgment Number**: 수신 측이 다음으로 기대하는 바이트 번호
- 이를 통해 **순서 보장** 및 **중복 탐지** 가능

#### 재전송 (Retransmission)

- **Timeout 기반 재전송**: RTO(Retransmission Timeout) 내에 ACK를 받지 못하면 재전송
- **Fast Retransmit**: 동일한 ACK를 3번 연속 수신(3 Duplicate ACKs)하면 타임아웃 전에 즉시 재전송

### 7.7 TCP 흐름 제어 (Flow Control)

- **수신 윈도우(Receive Window)** 를 사용
- 수신 측이 처리할 수 있는 버퍼 크기를 **Window Size** 필드로 송신 측에 알림
- 송신 측은 수신 윈도우 크기를 초과하지 않도록 전송량 조절
- **슬라이딩 윈도우(Sliding Window)** 방식으로 구현

### 7.8 TCP 혼잡 제어 (Congestion Control)

네트워크 혼잡을 감지하고 전송 속도를 조절하는 메커니즘.

#### 혼잡 윈도우 (Congestion Window, cwnd)

- 송신 측이 유지하는 윈도우
- 실제 전송 가능량 = min(cwnd, rwnd)

#### 주요 알고리즘

**Slow Start**
- cwnd를 1 MSS에서 시작
- ACK를 받을 때마다 cwnd를 **지수적으로 증가** (1→2→4→8...)
- **ssthresh(Slow Start Threshold)** 에 도달하면 Congestion Avoidance로 전환

**Congestion Avoidance**
- cwnd를 **선형적으로 증가** (RTT당 1 MSS씩)
- 패킷 손실 감지 시 조치 수행

**패킷 손실 감지 시 동작**

| 이벤트 | 동작 |
|--------|------|
| Timeout | ssthresh = cwnd/2, cwnd = 1 MSS (Slow Start 재시작) |
| 3 Duplicate ACKs | ssthresh = cwnd/2, cwnd = ssthresh (Fast Recovery) |

**Fast Recovery**
- 3 Duplicate ACKs 수신 시 진입
- cwnd = ssthresh + 3 MSS
- 이후 선형 증가 (Congestion Avoidance)
- Timeout 발생 시 Slow Start로 복귀

---

## 8. TLS (Transport Layer Security)

### 8.1 TLS란?

- 전송 계층 위에서 동작하는 **보안 프로토콜**
- TCP 연결 위에 **암호화**, **무결성**, **인증** 제공
- HTTPS = HTTP + TLS

### 8.2 TLS가 제공하는 보안

| 보안 목표 | 설명 |
|-----------|------|
| 기밀성 (Confidentiality) | 데이터 암호화로 도청 방지 |
| 무결성 (Integrity) | MAC(Message Authentication Code)으로 데이터 변조 탐지 |
| 인증 (Authentication) | 인증서(Certificate)를 통한 서버(선택적으로 클라이언트) 신원 확인 |

### 8.3 TLS Handshake (TLS 1.2)

```
Client                          Server
  |                                |
  |--- ClientHello --------------->|
  |    (지원 cipher suites,        |
  |     클라이언트 랜덤값)            |
  |                                |
  |<-- ServerHello ----------------|
  |    (선택된 cipher suite,        |
  |     서버 랜덤값)                 |
  |<-- Certificate ----------------|
  |    (서버 인증서)                 |
  |<-- ServerHelloDone ------------|
  |                                |
  |--- ClientKeyExchange --------->|
  |    (Pre-Master Secret)         |
  |--- ChangeCipherSpec ---------->|
  |--- Finished ------------------>|
  |                                |
  |<-- ChangeCipherSpec -----------|
  |<-- Finished -------------------|
  |                                |
  |    [Encrypted Communication]   |
```

1. **ClientHello**: 클라이언트가 지원하는 TLS 버전, cipher suite 목록, 랜덤값 전송
2. **ServerHello**: 서버가 cipher suite 선택, 랜덤값 전송
3. **Certificate**: 서버가 인증서(공개키 포함) 전송
4. **ServerHelloDone**: 서버 핸드셰이크 메시지 완료 알림
5. **ClientKeyExchange**: 클라이언트가 Pre-Master Secret 전송 (서버 공개키로 암호화)
6. **ChangeCipherSpec**: 이후 메시지부터 암호화 적용 알림
7. **Finished**: 핸드셰이크 완료 확인

### 8.4 키 생성 과정

1. Client Random + Server Random + Pre-Master Secret → **Master Secret** 생성
2. Master Secret → **세션 키(Session Keys)** 파생
   - 클라이언트 암호화 키
   - 서버 암호화 키
   - 클라이언트 MAC 키
   - 서버 MAC 키

### 8.5 TLS 1.3 개선사항

- 핸드셰이크 **1-RTT**로 단축 (TLS 1.2는 2-RTT)
- **0-RTT** 재연결 지원 (이전 세션 재사용)
- 취약한 cipher suite 제거 (RC4, 3DES, SHA-1 등)
- 핸드셰이크 메시지 대부분 암호화
- **Diffie-Hellman** 기반 키 교환만 지원 (RSA 키 교환 제거)
- 더 간결하고 안전한 cipher suite 구성

### 8.6 인증서 (Certificate)

- **X.509** 표준 형식
- 포함 내용: 도메인 이름, 공개키, 발급자(CA), 유효 기간, 디지털 서명
- **CA (Certificate Authority)**: 인증서를 발급하고 신뢰를 보증하는 기관
- **인증서 체인 (Certificate Chain)**: Root CA → Intermediate CA → Server Certificate

### 8.7 TLS 사용 사례

- HTTPS (웹 브라우징)
- 이메일 (SMTPS, IMAPS)
- VPN
- API 통신
- 데이터베이스 연결 암호화

---

## 9. 프로토콜 비교 요약

### TCP vs UDP

| 항목 | TCP | UDP |
|------|-----|-----|
| 연결 방식 | 연결 지향 (3-Way Handshake) | 비연결형 |
| 신뢰성 | 신뢰성 보장 (ACK, 재전송) | 비신뢰성 |
| 순서 보장 | O | X |
| 흐름 제어 | O (Window) | X |
| 혼잡 제어 | O (Slow Start, AIMD 등) | X |
| 헤더 크기 | 20~60 bytes | 8 bytes |
| 속도 | 상대적으로 느림 | 빠름 |
| 사용 예 | HTTP, FTP, SMTP, SSH | DNS, 스트리밍, 게임, DHCP |

### OSI 계층별 프로토콜 위치

| 계층 | 프로토콜 |
|------|----------|
| Application (L7) | HTTP, FTP, SMTP, DNS |
| Transport (L4) | TCP, UDP |
| Network (L3) | IP, ICMP, ARP |
| Data Link (L2) | Ethernet, Wi-Fi |
| Physical (L1) | 전기 신호, 광 신호 |

> TLS는 Transport 계층과 Application 계층 사이에 위치하여 보안 기능을 제공한다.
