package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class KafkaOrderDto implements Serializable {
    private KafkaConnectSchema schema;
    private KafkaConnectPayload payload;
}
