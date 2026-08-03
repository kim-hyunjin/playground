package com.example.sse.notification;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NotificationService notificationService;

    @Test
    void publishesNotification() throws Exception {
        NotificationEvent event = new NotificationEvent(
                1L,
                "notification",
                "배포가 완료되었습니다.",
                Instant.parse("2026-08-03T09:00:00Z")
        );
        when(notificationService.publish("배포가 완료되었습니다.")).thenReturn(event);

        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"배포가 완료되었습니다.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("notification"))
                .andExpect(jsonPath("$.message").value("배포가 완료되었습니다."));

        verify(notificationService).publish("배포가 완료되었습니다.");
    }

    @Test
    void rejectsBlankMessage() throws Exception {
        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"   \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnsConnectedClientCount() throws Exception {
        when(notificationService.connectedClientCount()).thenReturn(3);

        mockMvc.perform(get("/api/notifications/connections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(3));
    }
}

