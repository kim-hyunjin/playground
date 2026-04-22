# Kafka Connect

Kafka Connect를 통해 데이터를 Import/Export 할 수 있다.

```
데이터 소스(Hive, jdbc, ...) => Kafka Connect Source => Kafka Cluster => Kafka Connect Sink => Target System(S3, ...)
```

## 설치

### 1. kafka connect 설치

```
$ curl -O http://packages.confluent.io/archive/6.1/confluent-community-6.1.0.tar.gz

$ tar xvf confluent-community-6.1.0.tar.gz
```

### 2. kafka connect 플러그인 설치

원하는 플러그인을 찾아 다운받으면 된다. https://www.confluent.io/hub/

```
A Kafka Connect plugin can be:

a directory on the file system that contains all required JAR files
and third-party dependencies for the plugin.

This is most common and is preferred.
```

예제로 jdbc connector를 설치  
https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc

- confluentinc-kafka-connect-jdbc-10.2.5.zip

### 3. 플러그인 설정

플러그인이 위치한 경로를 설정 파일에 지정한다.

```
Kafka Connect finds the plugins using a plugin path
defined as a comma-separated list of directory paths
in the plugin.path worker configuration property.

To install a plugin, place the plugin directory
```

- /Users/hyunjin/dev/kafka/confluent-6.1.0/etc/kafka/connect-distributed.properties 파일 수정

```
plugin.path=/Users/hyunjin/dev/kafka/confluentinc-kafka-connect-jdbc-10.2.5/lib
```

### 4. JdbcSourceConnector에서 MariaDB를 사용하기 위해 mariadb 드라이버 필요

/Users/hyunjin/dev/kafka/confluent-6.1.0/share/java/kafka 경로에 mariadb-java-client-2.7.2.jar 파일 복사

### 5. kafka connect 실행

```
# 실행
$ /Users/hyunjin/dev/kafka/confluent-6.1.0/bin/connect-distributed etc/kafka/connect-distributed.properties

# 실행 (Windows)
$ .\bin\windows\connect-distributed.bat .\etc\kafka\connect-distributed.properties

# 구동 확인
$ curl http://localhost:8083/

# 설치된 플러그인 확인
$ curl http://localhost:8083/connector-plugins | python -m json.tool
```

#### windows 에러 발생 시

아래와 같은 에러가 발생한다면,

```
Classpath is empty. Please build the project first e.g. by running ‘gradlew jarAll’
```

.\bin\windows\kafka-run-class.bat 파일을 수정하자.

```
# rem Classpath addition for core 부분을 찾아서 그 위에 아래 코드 추가

rem Classpath addition for LSB style path
if exist %BASE_DIR%\share\java\kafka\* (
	call :concat %BASE_DIR%\share\java\kafka\*
)
```

## kafka source connect 추가 (MariaDB)

```
$ echo '
{
    "name" : "my-source-connect",
    "config" : {
        "connector.class" : "io.confluent.connect.jdbc.JdbcSourceConnector",
        "connection.url":"jdbc:mysql://localhost:3306/mydb",
        "connection.user":"root",
        "connection.password":"1234",
        "mode": "incrementing",
        "incrementing.column.name" : "id",
        "table.whitelist":"users",
        "topic.prefix" : "my_topic_",
        "tasks.max" : "1"
    }
}
' | curl -X POST -d @- http://localhost:8083/connectors --header "content-Type:application/json"

# 커넥터 등록 확인
$ curl http://localhost:8083/connectors

# 커넥터 상태 정보
$ curl http://localhost:8083/connectors/my-source-connect/status

# 커넥터 삭제
$ curl -X DELETE http://localhost:8083/connectors/my-source-connect

# 생성된 토픽 확인
$ docker exec -ti kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

커넥터를 생성하기 위해 /connectors 경로로 위와 같은 정보들을 body에 담아서 커넥터를 생성한다.  
jdbc 커넥터의 설정옵션은 간단하게 다음과 같다.

- connection.url, connection.user, connection.password  
  : DB에 접속하기 위한 설정 정보
- mode, incrementing. colmn.name  
  : 실행하고 있는 동안 커넥터는 jdbc를 통해 rdb를 폴링한다. 변경이 있으면 카프카에 전달하고 변경 감지는 incrementing 방법으로 진행한다. mode는 incrementing외에도 bulk, timestamp 등이 있다. incrementing.column.name 을 통해 변경을 감지한다.
- table.whitelist  
  : 로드할 대상의 테이블을 지정한다. 반대로 blacklist 도 있다.
- topic-prefix  
  : 카프카에 데이터를 넣을때 토픽 명을 결정할 접두어를 지정한다.
- tasks.max  
  : 이 커넥터에서 만들어지는 최소의 테스크 수

이제 source(connection config에 설정된 db와 table)에 변경이 발생하면
이를 감지하고 있다가 kafka 메시지를 만든다.

```
# 생성된 메시지 확인
$ docker exec -ti kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic my_topic_users --from-beginning
```

아래와 같은 메시지가 만들어진다.

```
{
    "schema":{
        "type":"struct",
        "fields":[
            {
                "type":"int32",
                "optional":false,
                "field":"id"
            },
            {
                "type":"string",
                "optional":true,
                "field":"user_id"
            },
            {
                "type":"string",
                "optional":true,
                "field":"pwd"
            },
            {
                "type":"string",
                "optional":true,
                "field":"name"
            },
            {
                "type":"int64",
                "optional":true,
                "name":"org.apache.kafka.connect.data.Timestamp",
                "version":1,
                "field":"created_at"
            }
        ],
        "optional":false,
        "name":"users"
    },
    "payload":{
        "id":2,
        "user_id":"user2",
        "pwd":"1234",
        "name":"lee",
        "created_at":1638687468000
    }
}
```

## kafka sink connect 추가 (MariaDB)

아래 예제에서는 my_topic_users 토픽으로 들어온 메시지를 보고 토픽과 동일한 이름의 테이블을 생성해 데이터를 복사할 것이다.

```
echo '
{
    "name":"my-sink-connect",
    "config":{
        "connector.class":"io.confluent.connect.jdbc.JdbcSinkConnector",
        "connection.url":"jdbc:mysql://localhost:3306/mydb",
        "connection.user":"root",
        "connection.password":"1234",
        "auto.create":"true",
        "auto.evolve":"true",
        "delete.enabled":"false",
        "tasks.max":"1",
        "topics":"my_topic_users"
    }
}
'| curl -X POST -d @- http://localhost:8083/connectors --header "content-Type:application/json"
```

## kafka consumer group 확인

```
$ docker exec -ti kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
```

## kafka consumer group 상제 정보

```
$ docker exec -ti kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group connect-my-sink-connect --describe
```

## kafka consumer group의 offset 변경하기

```
$ docker exec -ti kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group connect-my-sink-connect --topic my_topic_users --reset-offsets --to-latest --execute

오프셋의 위치를 재설정하기 위한 아래와같은 상세 옵션들이 있다.

--shift-by <Long: number-of-offsets> 형식 (+/- 모두 가능)
--to-offset <Long: offset>
--to-current
--by-duration <String: duration> : 형식 ‘PnDTnHnMnS’
--to-datetime <String: datetime> : 형식 ‘YYYY-MM-DDTHH:mm:SS.sss’
--to-latest
--to-earliest
```
