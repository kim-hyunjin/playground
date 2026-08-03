package com.example.sse.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PublishNotificationRequest(
        @NotBlank(message = "메시지를 입력해 주세요.")
        @Size(max = 200, message = "메시지는 200자 이하여야 합니다.")
        String message
) {
}

