package com.ahmedasfak.fintrack.service;

import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private final UserRepository userRepository;

    // public UserService(UserRepository userRepository) {
    // this.userRepository = userRepository;
    // }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Password encrypted usi BCrypt.
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return "User Registered Successfully";
    }
}