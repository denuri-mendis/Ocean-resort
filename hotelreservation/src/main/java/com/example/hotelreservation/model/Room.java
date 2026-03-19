package com.example.hotelreservation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available = true;
    private int capacity = 2;
    private String description;
    
    // Now only this one field
    private String imagePath;   // e.g. "/roomImages/room-101.jpg"

    private boolean deleted = false;
}