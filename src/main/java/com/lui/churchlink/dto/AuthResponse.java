package com.lui.churchlink.dto;

public record AuthResponse(
        String token,
        String username,
        Long expiresAt
) {}
