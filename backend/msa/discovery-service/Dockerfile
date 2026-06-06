FROM openjdk:11
VOLUME /tmp
COPY target/discovery-service-1.0.jar discovery-service.jar
ENTRYPOINT [ "java", "-jar", "discovery-service.jar" ]