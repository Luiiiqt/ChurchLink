package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AuthRequest;
import com.lui.churchlink.dto.AuthResponse;
import com.lui.churchlink.dto.RegisterRequest;
import com.lui.churchlink.service.CustomUserDetailsService;
import com.lui.churchlink.service.JwtTokenService;
import com.lui.churchlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserService userService;
    private final CustomUserDetailsService customUserDetailsService;

    public ApiAuthController(AuthenticationManager authenticationManager,
                             JwtTokenService jwtTokenService,
                             UserService userService,
                             CustomUserDetailsService customUserDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return authenticateAndGenerateToken(request.username(), request.password());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authenticateAndGenerateToken(request.username(), request.password());
    }

    @PostMapping("/renew")
    public AuthResponse renew(@RequestBody String oldToken) {
        String username = jwtTokenService.extractUsernameAllowExpired(oldToken);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        String newToken = jwtTokenService.generateToken(userDetails);
        Long expiresAt = System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L;
        return new AuthResponse(newToken, username, expiresAt);
    }

    private AuthResponse authenticateAndGenerateToken(String username, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtTokenService.generateToken(userDetails);
        Long expiresAt = System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L;
        return new AuthResponse(token, username, expiresAt);
    }
}
