package com.lui.churchlink.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;

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
                .expiresAt(now.plusSeconds(7 * 24 * 60 * 60)) // 7 days
                .subject(user.getUsername())
                .build();

        return encoder.encode(
                JwtEncoderParameters.from(
                        JwsHeader.with(MacAlgorithm.HS256).build(),
                        claims
                )
        ).getTokenValue();
    }

    public String extractUsername(String token) {
        try {
            return decoder.decode(token).getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null && username.equals(userDetails.getUsername());
    }

    /**
     * Extract username from token even if expired.
     */
    public String extractUsernameAllowExpired(String token) {
        try {
            // Works if token is valid
            return decoder.decode(token).getSubject();
        } catch (JwtException ex) {
            // If expired, decode manually using Base64
            try {
                String[] parts = token.split("\\.");
                if (parts.length != 3) return null;

                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));

                // Extract "sub":"username"
                int subIndex = payloadJson.indexOf("\"sub\"");
                if (subIndex == -1) return null;

                int colon = payloadJson.indexOf(":", subIndex);
                int q1 = payloadJson.indexOf("\"", colon);
                int q2 = payloadJson.indexOf("\"", q1 + 1);

                return payloadJson.substring(q1 + 1, q2);
            } catch (Exception e) {
                return null;
            }
        }
    }
}
