// src/main/java/com/example/hotelreservation/repository/UserRepository.java
package com.example.hotelreservation.repository;

import com.example.hotelreservation.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}