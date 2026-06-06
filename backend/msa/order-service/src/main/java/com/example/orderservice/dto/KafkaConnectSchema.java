package com.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KafkaConnectSchema {
    private String type;
    private List<KafkaConnectField> fields;
    private boolean optional;
    private String name;
}
