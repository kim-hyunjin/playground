package com.example.orderservice.messagequeue;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerConfig {

    private final Environment env;

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        log.info("kafka 설정 : {}", String.format("%s:%s", env.getProperty("kafka.my-config.host"), env.getProperty("kafka.my-config.port")));
        Map<String, Object> properties = new HashMap<>(); // 프로듀서 설정 정보
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, String.format("%s:%s", env.getProperty("kafka.my-config.host"), env.getProperty("kafka.my-config.port")));
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(properties);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
