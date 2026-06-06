package com.example.userservice.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;


@Configuration
public class Resilience4JConfig {

    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> globalCustomConfiguration() {
        CircuitBreakerConfig circuitBreakerConfig = CircuitBreakerConfig.custom()
                // CircuitBreaker를 열지 결정하는 failure rate threshold percentage. 기본값: 50
                .failureRateThreshold(4)

                // CircuitBreaker를 open 상태를 얼마나 지속할지 설정. 기본값: 60초
                .waitDurationInOpenState(Duration.ofMillis(1000))

                // CircuitBreaker가 닫힐 때 호출 결과를 기록하는데 사용되는 슬라이딩 창의 유형. 카운트 기반 또는 시간기반
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)

                // CircuitBreaker가 닫힐 때 호출 결과를 기록하는 데 사용되는 슬라이딩 창의 크기. 기본값 100. 카운트 기반이랑 횟수, 시간 기반이라면 시간 정보가 된다.
                .slidingWindowSize(2)
               .build();

        TimeLimiterConfig timeLimiterConfig = TimeLimiterConfig.custom()
                // TimeLimiter는 future supplier의 time limit을 정하는 API. 기본값 1초. 여기서는 order service
                .timeoutDuration(Duration.ofSeconds(4))
                .build();

        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                        .circuitBreakerConfig(circuitBreakerConfig)
                        .timeLimiterConfig(timeLimiterConfig)
                        .build());
    }
}
