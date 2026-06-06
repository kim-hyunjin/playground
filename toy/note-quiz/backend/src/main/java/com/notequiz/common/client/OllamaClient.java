package com.notequiz.common.client;

import com.notequiz.common.exception.ApiException;
import com.notequiz.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OllamaClient {

    private final WebClient webClient;

    @Value("${ollama.model}")
    private String model;

    public String generate(String prompt) {
        Map<String, Object> request = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false,
                "format", "json"
        );

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.get("response"))
                .retryWhen(Retry.fixedDelay(1, Duration.ofSeconds(2)))
                .timeout(Duration.ofSeconds(60))
                .onErrorResume(e -> {
                    log.error("Ollama call failed", e);
                    return Mono.error(new ApiException(ErrorCode.LLM_TIMEOUT));
                })
                .block();
    }

    public String generateWithImage(String prompt, String base64Image) {
        Map<String, Object> request = Map.of(
                "model", model,
                "prompt", prompt,
                "images", Collections.singletonList(base64Image),
                "stream", false
        );

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.get("response"))
                .retryWhen(Retry.fixedDelay(1, Duration.ofSeconds(2)))
                .timeout(Duration.ofSeconds(60))
                .onErrorResume(e -> {
                    log.error("Ollama image call failed", e);
                    return Mono.error(new ApiException(ErrorCode.LLM_TIMEOUT));
                })
                .block();
    }
}
