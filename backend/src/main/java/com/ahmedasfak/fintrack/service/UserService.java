package com.ahmedasfak.fintrack.service;

import com.ahmedasfak.fintrack.dto.LoginRequest;
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
    // For register User, we will check if the email already exists. If it does, we
    // will return an error message. If it doesn't, we will create a new user and
    // save it to the database. We will also encrypt the password using
    // BCryptPasswordEncoder.
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

    // For login User, we will check if the email exists. If it doesn't, we will
    // return an error message. If it does, we will check if the password matches.
    // If it doesn't, we will return an error message. If it does, we will return a
    // success message.
    public String login(LoginRequest request) {

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElse(null);

    if (user == null) {
        return "Incorrect email or password";
    }

    boolean passwordMatched =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword());

    if (!passwordMatched) {
        return "Incorrect email or password";
    }

    return "Login Successful";
}
}