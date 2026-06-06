package com.ahmedasfak.fintrack.controller;

import com.ahmedasfak.fintrack.dto.AuthResponse;
import com.ahmedasfak.fintrack.dto.LoginRequest;
import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request));
    }
}