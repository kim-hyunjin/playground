package com.example.sse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "sse.demo.enabled=false")
class SseExampleApplicationTest {

    @Test
    void contextLoads() {
    }
}
