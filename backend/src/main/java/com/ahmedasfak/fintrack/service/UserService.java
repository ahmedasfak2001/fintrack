package com.ahmedasfak.fintrack.service;

import com.ahmedasfak.fintrack.dto.AuthResponse;
import com.ahmedasfak.fintrack.security.JwtService;

import com.ahmedasfak.fintrack.dto.LoginRequest;
import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private final UserRepository userRepository;

    // public UserService(UserRepository userRepository) {
    // this.userRepository = userRepository;
    // }
    // For register User, we will check if the email already exists. If it does, we
    // will return an error message. If it doesn't, we will create a new user and
    // save it to the database. We will also encrypt the password using
    // BCryptPasswordEncoder.
    public String register(RegisterRequest request) {

        // if (userRepository.existsByEmail(request.getEmail())) {
        // return "Email already exists";
        // }
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already exists");
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

    // For login, we will check if the email exists. If it doesn't, we will return
    // an error message. If it does, we will check if the password matches. If it
    // doesn't,
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Incorrect email or password"));

        boolean passwordMatched = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!passwordMatched) {
            throw new RuntimeException("Incorrect email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        // return new AuthResponse(token);
        return new AuthResponse(
                token,
                user.getName());
    }
}