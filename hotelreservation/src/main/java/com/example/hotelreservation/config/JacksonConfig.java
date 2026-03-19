package com.example.hotelreservation.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Optional configuration for ObjectMapper bean
 * Spring Boot already provides an ObjectMapper bean by default,
 * but this allows you to customize it if needed.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Optional customizations:
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        // Add more configurations as needed
        return mapper;
    }
}