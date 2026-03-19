package com.example.hotelreservation.controller;

import com.example.hotelreservation.model.Customer;
import com.example.hotelreservation.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Create a new customer
     */
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer saved = customerService.createCustomer(customer);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * Get all customers
     */
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    /**
     * Get customer by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Update customer
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable String id,
            @RequestBody Customer updatedCustomer) {
        try {
            Customer updated = customerService.updateCustomer(id, updatedCustomer);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}