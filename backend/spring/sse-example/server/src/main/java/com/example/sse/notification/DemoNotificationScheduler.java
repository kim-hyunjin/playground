package com.example.sse.notification;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "sse.demo.enabled", havingValue = "true", matchIfMissing = true)
public class DemoNotificationScheduler {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final NotificationService notificationService;

    public DemoNotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Scheduled(fixedRateString = "${sse.demo.interval:3000}")
    public void publishServerTime() {
        if (notificationService.connectedClientCount() == 0) {
            return;
        }

        String currentTime = LocalTime.now().format(TIME_FORMAT);
        notificationService.publish("서버가 보낸 자동 이벤트 · " + currentTime);
    }
}

