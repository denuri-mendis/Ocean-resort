package com.example.hotelreservation.repository;

import com.example.hotelreservation.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    
    /**
     * Find customer by name (optional, for future use)
     */
    Optional<Customer> findByName(String name);
    
    /**
     * Find customers by contact number (optional, for future use)
     */
    List<Customer> findByContactNumber(String contactNumber);
}