package com.example.hotelreservation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/roomImages/**")                  // ← fixed: starts with "/"
                .addResourceLocations("classpath:/static/roomImages/") // good – trailing / is ok
                // Optional but recommended: add cache control, etc.
                .setCachePeriod(3600); // 1 hour cache (in seconds)
    }
}