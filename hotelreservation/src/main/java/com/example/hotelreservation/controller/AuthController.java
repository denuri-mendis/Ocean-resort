package com.example.hotelreservation.controller;

import com.example.hotelreservation.config.JwtUtil;
import com.example.hotelreservation.model.LoginRequest;
import com.example.hotelreservation.model.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String jwt = jwtUtil.generateToken(authentication.getName());

            return ResponseEntity.ok(new LoginResponse(jwt, request.getUsername()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}