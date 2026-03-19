package com.example.hotelreservation.config;

import com.example.hotelreservation.model.User;
import com.example.hotelreservation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("1234"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Admin user created successfully");
            }
        };
    }
}