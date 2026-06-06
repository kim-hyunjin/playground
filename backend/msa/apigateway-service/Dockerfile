FROM openjdk:11
VOLUME /tmp
COPY target/apigateway-service-1.0.jar apigateway-service.jar
ENTRYPOINT [ "java", "-jar", "apigateway-service.jar" ]