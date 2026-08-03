package com.example.sse.notification;

import java.time.Instant;

public record NotificationEvent(
        long id,
        String type,
        String message,
        Instant sentAt
) {
}

