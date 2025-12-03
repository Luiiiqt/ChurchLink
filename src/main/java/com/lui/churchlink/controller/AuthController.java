package com.lui.churchlink.controller;

import com.lui.churchlink.dto.AuthRequest;
import com.lui.churchlink.dto.AuthResponse;
import com.lui.churchlink.dto.RegisterRequest;
import com.lui.churchlink.model.User;
import com.lui.churchlink.service.JwtTokenService;
import com.lui.churchlink.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtTokenService jwtTokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
    }

    // ---------------- Register ----------------
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        userService.registerUser(
                request.firstName(),
                request.middleName(),
                request.lastName(),
                request.username(),
                request.password(),
                request.email()
        );
        return ResponseEntity.ok("User registered successfully");
    }


    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(), // username
                        request.password()  // password
                )
        );

        String token = jwtTokenService.generateToken(authentication);
        Long expiresAt = jwtTokenService.extractExpirationTime(token);

        return ResponseEntity.ok(
                new AuthResponse(token, request.username(), expiresAt)
        );
    }
}