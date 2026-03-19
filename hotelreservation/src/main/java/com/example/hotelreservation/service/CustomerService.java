package com.example.hotelreservation.service;

import com.example.hotelreservation.model.Customer;
import com.example.hotelreservation.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    /**
     * Create a new customer
     */
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    /**
     * Get all customers
     */
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Get customer by ID
     */
    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    /**
     * Update customer
     */
    public Customer updateCustomer(String id, Customer updatedCustomer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        if (updatedCustomer.getName() != null) {
            existing.setName(updatedCustomer.getName());
        }
        if (updatedCustomer.getContactNumber() != null) {
            existing.setContactNumber(updatedCustomer.getContactNumber());
        }
        if (updatedCustomer.getAddress() != null) {
            existing.setAddress(updatedCustomer.getAddress());
        }

        return customerRepository.save(existing);
    }

    /**
     * Delete customer
     */
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}