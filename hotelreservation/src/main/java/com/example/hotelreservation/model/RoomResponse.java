package com.example.hotelreservation.model;

import lombok.Data;

@Data
public class RoomResponse {
    private String id;
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available;
    private int capacity;
    private String description;
    private String imageUrl;
}