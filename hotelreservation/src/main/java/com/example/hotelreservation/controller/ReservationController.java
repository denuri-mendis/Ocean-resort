package com.example.hotelreservation.controller;

import com.example.hotelreservation.model.Reservation;
import com.example.hotelreservation.model.ReservationRequest;
import com.example.hotelreservation.model.ReservationWithDetails;
import com.example.hotelreservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Check room availability for given dates (called before showing customer form)
     */
    @PostMapping("/check-availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(@RequestBody ReservationRequest request) {
        boolean available = reservationService.isRoomAvailable(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("available", available);
        response.put("roomId", request.getRoomId());
        response.put("checkInDate", request.getCheckInDate());
        response.put("checkOutDate", request.getCheckOutDate());

        if (!available) {
            response.put("message", "Room is already booked for the selected dates");
        } else {
            response.put("message", "Room is available");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Create reservation (called after availability is confirmed)
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            Reservation saved = reservationService.createReservation(request);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * View all reservations with full details
     */
    @GetMapping
    public ResponseEntity<List<ReservationWithDetails>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    /**
     * View one reservation by reservation number
     */
    @GetMapping("/{reservationNumber}")
    public ResponseEntity<ReservationWithDetails> getReservation(@PathVariable String reservationNumber) {
        return ResponseEntity.ok(reservationService.getReservationByNumber(reservationNumber));
    }

    /**
     * NEW: Update key handover status
     */
    @PatchMapping("/{reservationNumber}/key-status")
    public ResponseEntity<?> updateKeyStatus(
            @PathVariable String reservationNumber,
            @RequestBody Map<String, String> body) {
        try {
            String keyStatus = body.get("keyStatus");
            Reservation updated = reservationService.updateKeyStatus(reservationNumber, keyStatus);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * NEW: Check out a guest
     */
    @PostMapping("/{reservationNumber}/checkout")
    public ResponseEntity<?> checkOutGuest(@PathVariable String reservationNumber) {
        try {
            Reservation updated = reservationService.checkOutGuest(reservationNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Guest checked out successfully");
            response.put("reservationNumber", reservationNumber);
            response.put("reservation", updated);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Cancel a reservation
     */
    @DeleteMapping("/{reservationNumber}")
    public ResponseEntity<Map<String, String>> cancelReservation(@PathVariable String reservationNumber) {
        reservationService.cancelReservation(reservationNumber);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation cancelled successfully");
        response.put("reservationNumber", reservationNumber);
        
        return ResponseEntity.ok(response);
    }
}