package com.example.orderservice.messagequeue;

import com.example.orderservice.dto.OrderDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderDto sendOrder(String kafkaTopic, OrderDto orderDto) {
        String jsonString = "";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
          jsonString = objectMapper.writeValueAsString(orderDto);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        kafkaTemplate.send(kafkaTopic, jsonString);
        log.info("Kafka Producer send data from the Order micro service: {}", orderDto);

        return orderDto;
    }
}
