package com.example.hotelreservation.repository;

import com.example.hotelreservation.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {

    // For available rooms by type (already used in your code)
    List<Room> findByTypeAndAvailableTrue(String type);

    // NEW: Soft delete support - CHANGED from isDeleted to deleted
    List<Room> findByDeletedFalse();  // was: findByIsDeletedFalse()

    Optional<Room> findByIdAndDeletedFalse(String id);  // was: findByIdAndIsDeletedFalse()
}