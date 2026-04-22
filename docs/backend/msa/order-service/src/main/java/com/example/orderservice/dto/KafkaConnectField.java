package com.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KafkaConnectField {
    private String type;
    private boolean optional;
    private String field;
}
