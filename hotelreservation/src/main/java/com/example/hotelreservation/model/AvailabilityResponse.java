package com.example.hotelreservation.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityResponse {
    private boolean available;
    private String roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String message;
}