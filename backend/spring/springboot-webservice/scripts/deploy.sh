#!/bin/bash

REPOSITORY=/home/ec2-user/app/step2
PROJECT_NAME=springboot2-webservice

echo "> build 파일 복사"

cp $REPOSITORY/zip/*.jar $REPOSITORY/

echo "> 현재 구동중인 애플리케이션 pid확인"

CURRENT_PID=$(pgrep -fl ${PROJECT_NAME} | grep jar | awk '{print $1}') #스프링부트 애플리케이션 이름(springboot2-webservice)으로 된 다른 프로그램들이 있을 수 있어 프로세스를 찾은 뒤 ID를 찾는다

echo "현재 구동중인 애플리케이션 pid: $CURRENT_PID"

if [ -z "$CURRENT_PID" ]; then
        echo "> 현재 구동중인 애플리케이션이 없으므로 종료하지 않습니다."
else
        echo "> kill -15 $CURRENT_PID"
        kill -15 $CURRENT_PID
        sleep 5
fi

echo "> 새 애플리케이션 배포"

JAR_NAME=$(ls -tr $REPOSITORY/*.jar | grep jar | tail -n 1)

echo "> JAR Name: $JAR_NAME"

echo "> $JAR_NAME 에 실행권한 추가"

#Jar파일은 실행권한이 없는 상태. nohup으로 실행할 수 있게 실행 권한을 부여
chmod +x $JAR_NAME

echo "> $JAR_NAME 실행"

nohup java -jar -Dspring.config.location=classpath:/application.properties,/home/ec2-user/app/application-oauth.properties,/home/ec2-user/app/application-real-db.properties,classpath:/application-real.properties -Dspring.profiles.active=real $JAR_NAME > $REPOSITORY/nohup.out 2>&1 &
