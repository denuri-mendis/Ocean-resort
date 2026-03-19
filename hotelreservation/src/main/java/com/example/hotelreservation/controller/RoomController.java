package com.example.hotelreservation.controller;

import com.example.hotelreservation.model.Room;
import com.example.hotelreservation.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ObjectMapper objectMapper;  // Inject ObjectMapper as a bean

    // Add room (multipart form with room JSON + optional image)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Room> addRoom(
            @RequestPart("room") String roomJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        Room room = objectMapper.readValue(roomJson, Room.class);
        Room saved = roomService.addRoomWithImage(room, image);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    // Get all active rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getActiveRooms());
    }

    // Get one active room
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable String id) {
        Room room = roomService.getActiveRoomById(id);
        return ResponseEntity.ok(room);
    }

    // Update room - FIXED: room part is now optional to allow image-only updates
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Room> updateRoom(
            @PathVariable String id,
            @RequestPart(value = "room", required = false) String roomJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        Room updatedRoom = null;
        if (roomJson != null && !roomJson.isEmpty()) {
            updatedRoom = objectMapper.readValue(roomJson, Room.class);
        }

        Room updated = roomService.updateRoom(id, updatedRoom, image);
        return ResponseEntity.ok(updated);
    }

    // Soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.softDeleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}