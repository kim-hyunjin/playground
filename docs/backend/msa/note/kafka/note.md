# Apache Kafka

- Apache Software Foundation의 Scalar 언어로 된 오픈 소스 메시지 브로커 프로젝트
- 링크드인에서 개발, 2011년 오픈소스화, 2014년 Confluent라는 회사 창립
- 실시간 데이터 피드 관리를 위한 높은 처리량, 낮은 지연 시간을 지닌 플랫폼 제공

### 기존 End-to-End 시스템의 문제

- 데이터 연동의 복잡성 증가
- 서로 다른 데이터 Pipeline 연결 구조
- 확장이 어렵다

### 특징

- Producer/Consumer 분리
- 메시지를 여러 Consumer에게 허용
- 높은 처리량을 위한 메시지 최적화
- Scale-out 가능
- Eco-system

```
            Zookeeper : 메타데이터(Broker ID, Controller ID 등)저장
      /         |           \
  ---------------------------------
  |Broker #0  Broker #1  Broker #2| --> Kafka Cluster : 보통 3대 이상의 Broker로 구성된다.
  ---------------------------------
n개의 Broker 중에서 1대는 Controller 기능을 수행한다.

Controller?
  - 각 Broker에게 담당 파티션을 할당한다.
  - Broker가 정상 동작하는지 모니터링한다.
```

### Kafka 홈페이지

- http://kafka.apache.org

### Kafka와 데이터를 주고받기 위해 사용하는 Java Library

- https://mvnrepository.com/artifact/org.apache.kafka/kafka-clients

### Zookeeper 및 Kafka 서버 기동

```
$KAFKA_HOME/bin/zookeeper-server-start.sh  $KAFKA_HOME/config/zookeeper.properties

$KAFKA_HOME/bin/kafka-server-start.sh  $KAFKA_HOME/config/server.properties
```

### Topic 생성

```
$KAFKA_HOME/bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092 \
--partitions 1
```

### Topic 목록 확인

```
$KAFKA_HOME/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

### Topic 정보 확인

```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
```

### Windows에서 기동

- 모든 명령어는 $KAFKA_HOME\bin\windows 폴더에 저장

```
.\bin\windows\zookeeper-server-start.bat  .\config\zookeeper.properties
```

### 메시지 생산

```
$KAFKA_HOME/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic quickstart-events
```

### 메시지 소비

```
$KAFKA_HOME/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic quickstart-events \
--from-beginning
```

### Kafka 사용 예

한 서비스에 인스턴스가 여러개 일때, 인스턴스마다 서로 다른 DB를 사용한다면?  
인스턴스 간 `데이터 동기화 문제 발생`한다!  
==> 이 때 kafka 등장, `kafka sink connector`로 topic에 들어오는 메시지를 `단일 DB`에 저장함으로써 데이터 동기화 문제를 `해결할 수 있다.`  
==> CQRS 패턴을 적용하면 성능적으로 더 큰 효과를 볼 수 있다.

#### CQRS 패턴이란?

https://docs.microsoft.com/ko-kr/azure/architecture/patterns/cqrs
