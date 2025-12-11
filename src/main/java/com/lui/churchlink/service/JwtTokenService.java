package com.lui.churchlink.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtTokenService {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public JwtTokenService(JwtEncoder encoder, JwtDecoder decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    public String generateToken(UserDetails user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("churchlink")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(3600))
                .subject(user.getUsername())
                .build();

        return encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                claims
        )).getTokenValue();
    }

    public String extractUsername(String token) {
        try {
            Jwt jwt = decoder.decode(token);
            return jwt.getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null && username.equals(userDetails.getUsername());
    }
}
