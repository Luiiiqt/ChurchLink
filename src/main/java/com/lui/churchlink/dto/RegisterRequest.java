package com.lui.churchlink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 20)
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6)
        String password
) {}
