package com.example.hotelreservation.model;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RoomRequest{
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available;
    private int capacity;
    private String description;
    private MultipartFile image;   // file upload
}