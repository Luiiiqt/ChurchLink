package com.lui.churchlink.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class JwtTokenService {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public JwtTokenService(JwtEncoder encoder, JwtDecoder decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    // Generate JWT token
    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        // Collect authorities/roles as a space-separated string
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("churchlink")          // optional: specify issuer
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS)) // token valid for 1 hour
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();

        var encoderParameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                claims
        );

        return this.encoder.encode(encoderParameters).getTokenValue();
    }

    // Extract expiration timestamp from JWT
    public Long extractExpirationTime(String token) {
        Jwt jwt = decoder.decode(token);
        Instant exp = jwt.getExpiresAt();
        return exp != null ? exp.toEpochMilli() : null;
    }

    // Extract username from JWT
    public String extractUsername(String token) {
        Jwt jwt = decoder.decode(token);
        return jwt.getSubject();
    }
}
