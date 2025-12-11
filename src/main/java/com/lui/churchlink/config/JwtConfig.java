package com.lui.churchlink.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.spec.SecretKeySpec;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret-key:12345678901234567890123456789012}") // default 32-char secret
    private String jwtSecretKey;

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey.getBytes()));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKeySpec keySpec = new SecretKeySpec(jwtSecretKey.getBytes(), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(keySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }
}
