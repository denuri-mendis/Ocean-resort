package com.example.hotelreservation.service;

import com.example.hotelreservation.model.*;
import com.example.hotelreservation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final CustomerService customerService;
    private final RoomService roomService;

    /**
     * Check if a room is available for the given date range
     */
    public boolean isRoomAvailable(String roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                roomId, checkInDate, checkOutDate
        );
        return overlapping.isEmpty();
    }

    /**
     * Create new reservation with availability check
     */
    public Reservation createReservation(ReservationRequest request) {
        // Step 1: Validate dates
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        // Step 2: Check room availability
        if (!isRoomAvailable(request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new RuntimeException("Room is already booked for the selected dates");
        }

        // Step 3: Save customer
        Customer customer = new Customer();
        customer.setName(request.getGuestName());
        customer.setAddress(request.getAddress());
        customer.setContactNumber(request.getContactNumber());

        Customer savedCustomer = customerService.createCustomer(customer);

        // Step 4: Get room to calculate total
        Room room = roomService.getRoomById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found: " + request.getRoomId()));

        // Step 5: Calculate total amount
        double total = nights * room.getPricePerNight();

        // Step 6: Create & save reservation
        Reservation reservation = new Reservation();
        reservation.setCustomerId(savedCustomer.getId());
        reservation.setRoomId(request.getRoomId());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setTotalAmount(total);
        reservation.setReservationNumber("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        reservation.setStatus("CONFIRMED");
        reservation.setKeyStatus("NOT_HANDED");  // Default: key not handed over

        Reservation savedReservation = reservationRepository.save(reservation);

        // Step 7: Update room availability to false
        roomService.updateRoomAvailability(request.getRoomId(), false);

        return savedReservation;
    }

    /**
     * View all reservations with joined customer + room details
     */
    public List<ReservationWithDetails> getAllReservations() {
        return reservationRepository.findAll().stream().map(res -> {
            ReservationWithDetails dto = new ReservationWithDetails();
            dto.setReservationId(res.getId());
            dto.setReservationNumber(res.getReservationNumber());
            dto.setCheckInDate(res.getCheckInDate());
            dto.setCheckOutDate(res.getCheckOutDate());
            dto.setTotalAmount(res.getTotalAmount());
            dto.setStatus(res.getStatus());
            dto.setKeyStatus(res.getKeyStatus());  // Include key status

            // Customer details
            customerService.getCustomerById(res.getCustomerId()).ifPresent(c -> {
                dto.setGuestName(c.getName());
                dto.setContactNumber(c.getContactNumber());
                dto.setAddress(c.getAddress());
            });

            // Room details
            roomService.getRoomById(res.getRoomId()).ifPresent(r -> {
                dto.setRoomNumber(r.getRoomNumber());
                dto.setRoomType(r.getType());
                dto.setPricePerNight(r.getPricePerNight());
            });

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * View single reservation by reservationNumber
     */
    public ReservationWithDetails getReservationByNumber(String reservationNumber) {
        Reservation res = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        ReservationWithDetails dto = new ReservationWithDetails();
        dto.setReservationId(res.getId());
        dto.setReservationNumber(res.getReservationNumber());
        dto.setCheckInDate(res.getCheckInDate());
        dto.setCheckOutDate(res.getCheckOutDate());
        dto.setTotalAmount(res.getTotalAmount());
        dto.setStatus(res.getStatus());
        dto.setKeyStatus(res.getKeyStatus());

        customerService.getCustomerById(res.getCustomerId()).ifPresent(c -> {
            dto.setGuestName(c.getName());
            dto.setContactNumber(c.getContactNumber());
            dto.setAddress(c.getAddress());
        });

        roomService.getRoomById(res.getRoomId()).ifPresent(r -> {
            dto.setRoomNumber(r.getRoomNumber());
            dto.setRoomType(r.getType());
            dto.setPricePerNight(r.getPricePerNight());
        });

        return dto;
    }

    /**
     * NEW: Update key handover status
     */
    public Reservation updateKeyStatus(String reservationNumber, String keyStatus) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (!keyStatus.equals("NOT_HANDED") && !keyStatus.equals("HANDED_OVER")) {
            throw new RuntimeException("Invalid key status. Must be NOT_HANDED or HANDED_OVER");
        }
        
        reservation.setKeyStatus(keyStatus);
        
        // If key is handed over, update status to CHECKED_IN
        if (keyStatus.equals("HANDED_OVER") && reservation.getStatus().equals("CONFIRMED")) {
            reservation.setStatus("CHECKED_IN");
        }
        
        return reservationRepository.save(reservation);
    }

    /**
     * NEW: Check out a guest
     */
    public Reservation checkOutGuest(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (reservation.getStatus().equals("CHECKED_OUT")) {
            throw new RuntimeException("Guest has already checked out");
        }
        
        if (reservation.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Cannot check out a cancelled reservation");
        }
        
        // Update reservation status
        reservation.setStatus("CHECKED_OUT");
        Reservation updated = reservationRepository.save(reservation);
        
        // Make room available again
        roomService.updateRoomAvailability(reservation.getRoomId(), true);
        
        return updated;
    }

    /**
     * Cancel a reservation and make room available again
     */
    public void cancelReservation(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
        
        // Make room available again
        roomService.updateRoomAvailability(reservation.getRoomId(), true);
    }
}