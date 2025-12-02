package com.lui.churchlink.service;

import com.lui.churchlink.model.User;
import com.lui.churchlink.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user with full personal info
    public void registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = new User();
        user.setFirstName(request.first Name());
        user.setMiddleName(request.middleName());
        user.setLastName(request.lastName());
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());

        userRepository.save(user);
    }
}
