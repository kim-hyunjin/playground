```
application.yml과 같은 설정 파일은 다음과 같이 3가지 종류로 사용하실 수 있으며, 각 파일마다 Spring Boot에 읽어 들이는 우선순위가 정해져 있습니다. 

1. application.yml

2. [application-name].yml

3. [application-name]-[profile].yml

우선순위는 3개의 파일이 모두 존재한다고 가정했을 때, 3번 - 2번 - 1번 순입니다. 

spring config service에 설정된 내용을 웹 브라우저에서 확인하기 위해서 (port가 8888이라 가정할 때)

http://127.0.0.1:8888/[application name]/[profile] 로 접속하시면 됩니다. 이중 profile을 지정하지 않으면 default가 설정 되며, 질문하신 내용처럼 dev porfile을 확인하시고자 한다면

http://127.0.0.1:8888/user-service/dev 라고 하시면 됩니다. 

profile을 지정해서 해당 애플리케이션을 실행하면, profile의 설정 파일이 사용되며, profile에 존재하지 않는 항목들은 바로 위 단계인 [application-nae].yml 파일, 그리고 application.yml에서 정보를 검색해서 사용하게 됩니다. 쉽게 말해 profile의 설정은 해당 profile에서 추가하거나 변경(override)하려는 설정을 넣어서 사용하시면 됩니다. 예를 들어 dev 환경에서의 DB 접속 정보를 prod 환경과 달리 하는 등의 정보를 설정하시면 됩니다.
```

# jdk keytool을 사용해 비대칭 암호화하기
### jks 파일 만들기
```
$ keytool -genkeypair -alias apiEncKey -keyalg RSA \
 -dname "CN=HyunJin Kim, OU=API Development, O=kim-hyunjin.github.com, L=Seoul, C=KR" \
 -keypass "1234qwer" -keystore apiEncKey.jks -storepass "1234qwer"
```

### 생성된 keystore 정보 보기
```
$ keytool -list -keystore .\apiEncKey.jks -v
```

### 인증서 export
```
$ keytool -export -alias apiEnckey -keystore apiEncKey.jks -rfc -file trustServer.cer
$ keytool -list -keystore .\apiEncKey.jks -v

Enter keystore password:
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

Alias name: apienckey
Creation date: 2021. 12. 1.
Entry type: PrivateKeyEntry <-- 타입이 개인키
```

### 인증서 import
```
$ keytool -import -alias trustServer -file .\trustServer.cer -keystore publicKey.jks
$ keytool -list -keystore .\publicKey.jks -v

Enter keystore password:
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

Alias name: trustserver
Creation date: 2021. 12. 1.
Entry type: trustedCertEntry <-- 타입이 공개키
```