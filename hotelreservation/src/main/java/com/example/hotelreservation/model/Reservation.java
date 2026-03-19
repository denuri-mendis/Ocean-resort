package com.example.hotelreservation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;

@Data
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    private String reservationNumber;   // e.g. "RES-ABC123"

    private String customerId;          // FK to Customer
    private String roomId;              // FK to Room

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private double totalAmount;

    private String status = "CONFIRMED";  // CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
    
    // NEW FIELD: Track if guest has received the key
    private String keyStatus = "NOT_HANDED";  // NOT_HANDED, HANDED_OVER
}