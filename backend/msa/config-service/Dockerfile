FROM openjdk:11
VOLUME /tmp
COPY apiEncKey.jks apiEncKey.jks
COPY target/config-service-1.0.jar config-service.jar
ENTRYPOINT [ "java", "-jar", "config-service.jar" ]