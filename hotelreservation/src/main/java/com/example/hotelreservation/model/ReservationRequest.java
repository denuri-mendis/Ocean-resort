package com.example.hotelreservation.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequest {
    private String guestName;
    private String address;
    private String contactNumber;
    private String roomId;           // must exist in DB
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}