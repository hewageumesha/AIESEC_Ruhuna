package com.example.EventManagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring Boot to serve files from the 'uploads/' folder.
        registry.addResourceHandler("/uploads/**") // Map URL path to directory
                .addResourceLocations("file:uploads/"); // The directory where images are saved
    }
}