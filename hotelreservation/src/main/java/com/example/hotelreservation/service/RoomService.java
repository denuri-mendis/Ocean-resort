package com.example.hotelreservation.service;

import com.example.hotelreservation.model.Room;
import com.example.hotelreservation.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final ImageService imageService;  // local file upload service

    // ─────────────────────────────────────────────
    // Basic / existing methods (kept as they were)
    // ─────────────────────────────────────────────

    public Room addRoom(Room room) {
        room.setDeleted(false);
        room.setAvailable(true);
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    public List<Room> getAvailableRoomsByType(String type) {
        return roomRepository.findByTypeAndAvailableTrue(type);
    }

    public Room updateRoomAvailability(String roomId, boolean available) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setAvailable(available);
        return roomRepository.save(room);
    }

    // ─────────────────────────────────────────────
    // Methods with image support (multipart)
    // ─────────────────────────────────────────────

    /**
     * Add new room – supports optional image upload
     */
    public Room addRoomWithImage(Room room, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = imageService.saveImage(imageFile);
            room.setImagePath(imagePath);
        }

        room.setDeleted(false);
        room.setAvailable(true);
        return roomRepository.save(room);
    }

    /**
     * Get only active (not deleted) rooms – recommended for frontend lists
     */
    public List<Room> getActiveRooms() {
        return roomRepository.findByDeletedFalse();
    }

    /**
     * Get one active room by ID
     */
    public Room getActiveRoomById(String id) {
        return roomRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Room not found or has been deleted"));
    }

    /**
     * Update existing room – supports changing image
     * FIXED: Now handles null updatedRoom for image-only updates
     */
    public Room updateRoom(String id, Room updatedRoom, MultipartFile imageFile) throws IOException {
        Room existing = getActiveRoomById(id);

        // Update only provided fields (only if updatedRoom is not null)
        if (updatedRoom != null) {
            if (updatedRoom.getRoomNumber() != null) {
                existing.setRoomNumber(updatedRoom.getRoomNumber());
            }
            if (updatedRoom.getType() != null) {
                existing.setType(updatedRoom.getType());
            }
            if (updatedRoom.getPricePerNight() > 0) {
                existing.setPricePerNight(updatedRoom.getPricePerNight());
            }
            // Check if available status has changed
            existing.setAvailable(updatedRoom.isAvailable());
            
            if (updatedRoom.getCapacity() > 0) {
                existing.setCapacity(updatedRoom.getCapacity());
            }
            if (updatedRoom.getDescription() != null) {
                existing.setDescription(updatedRoom.getDescription());
            }
        }

        // Replace image if new file is provided (works even when updatedRoom is null)
        if (imageFile != null && !imageFile.isEmpty()) {
            String newImagePath = imageService.saveImage(imageFile);
            existing.setImagePath(newImagePath);
            // Optional: delete old image file here if you want
        }

        return roomRepository.save(existing);
    }

    /**
     * Soft delete – set deleted = true
     */
    public void softDeleteRoom(String id) {
        Room room = getActiveRoomById(id);
        room.setDeleted(true);
        room.setAvailable(false); // optional
        roomRepository.save(room);
    }
}