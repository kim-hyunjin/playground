package com.example.sse.notification;

import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return notificationService.connect();
    }

    @PostMapping
    public NotificationEvent publish(@Valid @RequestBody PublishNotificationRequest request) {
        return notificationService.publish(request.message());
    }

    @GetMapping("/connections")
    public Map<String, Integer> connections() {
        return Map.of("count", notificationService.connectedClientCount());
    }
}

