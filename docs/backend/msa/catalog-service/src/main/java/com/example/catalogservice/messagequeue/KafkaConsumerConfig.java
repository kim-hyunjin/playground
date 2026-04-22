package com.example.catalogservice.messagequeue;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerConfig {

    private final Environment env;

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        log.info("kafka 설정 : {}", String.format("%s:%s", env.getProperty("kafka.my-config.host"), env.getProperty("kafka.my-config.port")));
        Map<String, Object> properties = new HashMap<>(); // 컨슈머 접속정보 등 설정
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, String.format("%s:%s", env.getProperty("kafka.my-config.host"), env.getProperty("kafka.my-config.port")));
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "consumerGroupId"); // 여러 컨슈머를 특정 그룹ID를 사용해 하나로 묶을 수 있다.
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(properties);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() { // 토픽의 변경사항 감지
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
