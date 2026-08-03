package com.example.sse.notification;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class NotificationService {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final AtomicLong eventSequence = new AtomicLong();
    private final long emitterTimeout;
    private final Function<Long, SseEmitter> emitterFactory;

    @Autowired
    public NotificationService(@Value("${sse.emitter-timeout:1800000}") long emitterTimeout) {
        this(emitterTimeout, SseEmitter::new);
    }

    NotificationService(long emitterTimeout, Function<Long, SseEmitter> emitterFactory) {
        this.emitterTimeout = emitterTimeout;
        this.emitterFactory = emitterFactory;
    }

    public SseEmitter connect() {
        String clientId = UUID.randomUUID().toString();
        SseEmitter emitter = emitterFactory.apply(emitterTimeout);

        emitters.put(clientId, emitter);
        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));
        emitter.onError(error -> emitters.remove(clientId));

        NotificationEvent connected = createEvent("connected", "SSE 연결이 완료되었습니다.");
        try {
            emitter.send(toSseEvent(connected));
        } catch (IOException | IllegalStateException error) {
            emitters.remove(clientId);
            emitter.completeWithError(error);
        }

        return emitter;
    }

    public NotificationEvent publish(String message) {
        NotificationEvent event = createEvent("notification", message.trim());
        emitters.forEach((clientId, emitter) -> send(clientId, emitter, event));
        return event;
    }

    public int connectedClientCount() {
        return emitters.size();
    }

    private NotificationEvent createEvent(String type, String message) {
        return new NotificationEvent(
                eventSequence.incrementAndGet(),
                type,
                message,
                Instant.now()
        );
    }

    private SseEmitter.SseEventBuilder toSseEvent(NotificationEvent event) {
        return SseEmitter.event()
                .id(Long.toString(event.id()))
                .name(event.type())
                .reconnectTime(3_000)
                .data(event);
    }

    private void send(String clientId, SseEmitter emitter, NotificationEvent event) {
        try {
            emitter.send(toSseEvent(event));
        } catch (IOException | IllegalStateException error) {
            emitters.remove(clientId);
            emitter.complete();
        }
    }
}
