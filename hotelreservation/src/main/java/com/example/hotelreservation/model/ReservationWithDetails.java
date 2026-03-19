package com.example.hotelreservation.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationWithDetails {
    private String reservationId;
    private String reservationNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private double totalAmount;
    private String status;              // CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
    private String keyStatus;           // NOT_HANDED, HANDED_OVER

    // Joined from Customer
    private String guestName;
    private String address;
    private String contactNumber;

    // Joined from Room
    private String roomNumber;
    private String roomType;
    private double pricePerNight;
}