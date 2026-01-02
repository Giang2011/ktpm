package com.bluemoon.bluemoonv1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Cho phép credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Chỉ định cụ thể origins (không dùng * khi có credentials)
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",  // Next.js dev server
            "http://localhost:3001",  // Backup port
            "http://127.0.0.1:3000"   // Alternative localhost
        ));
        
        // Cho phép tất cả các HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Cho phép tất cả các headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Expose các headers mà frontend cần đọc
        config.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Total-Count"
        ));
        
        // Cache preflight request trong 1 giờ
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
