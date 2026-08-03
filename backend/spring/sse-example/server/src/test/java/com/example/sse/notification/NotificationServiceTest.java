package com.example.sse.notification;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

class NotificationServiceTest {

    @Test
    void connectedClientReceivesInitialAndPublishedEvents() {
        AtomicInteger sentEventCount = new AtomicInteger();
        NotificationService service = new NotificationService(
                1_000L,
                timeout -> new CountingSseEmitter(timeout, sentEventCount)
        );

        SseEmitter emitter = service.connect();
        NotificationEvent event = service.publish("테스트 알림");

        assertThat(emitter.getTimeout()).isEqualTo(1_000L);
        assertThat(service.connectedClientCount()).isEqualTo(1);
        assertThat(sentEventCount).hasValue(2);
        assertThat(event.type()).isEqualTo("notification");
        assertThat(event.message()).isEqualTo("테스트 알림");
    }

    private static final class CountingSseEmitter extends SseEmitter {

        private final AtomicInteger sentEventCount;

        private CountingSseEmitter(Long timeout, AtomicInteger sentEventCount) {
            super(timeout);
            this.sentEventCount = sentEventCount;
        }

        @Override
        public void send(SseEventBuilder builder) throws IOException {
            sentEventCount.incrementAndGet();
        }
    }
}

