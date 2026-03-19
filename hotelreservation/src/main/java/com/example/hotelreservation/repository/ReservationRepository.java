package com.example.hotelreservation.repository;

import com.example.hotelreservation.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
    /**
     * Find reservation by unique reservation number
     */
    Optional<Reservation> findByReservationNumber(String reservationNumber);
    
    /**
     * Find all reservations for a specific room
     */
    List<Reservation> findByRoomId(String roomId);
    
    /**
     * Find overlapping reservations for a room within a date range.
     * 
     * Two date ranges overlap when:
     * - Existing check-in < New check-out AND
     * - Existing check-out > New check-in
     * 
     * Example scenarios:
     * 
     * Existing: Feb 10-15
     * New: Feb 13-18 → OVERLAP (13 < 15 AND 18 > 10) ✓
     * 
     * Existing: Feb 10-15
     * New: Feb 15-20 → NO OVERLAP (15 < 15 is false) ✗
     * 
     * @param roomId The room to check
     * @param newCheckInDate The new booking's check-in date
     * @param newCheckOutDate The new booking's check-out date
     * @return List of overlapping reservations (empty if none)
     */
    @Query("{ 'roomId': ?0, " +
           "'checkInDate': { $lt: ?2 }, " +  // existing check-in < new check-out
           "'checkOutDate': { $gt: ?1 } }")  // existing check-out > new check-in
    List<Reservation> findOverlappingReservations(
            String roomId, 
            LocalDate newCheckInDate, 
            LocalDate newCheckOutDate
    );
}