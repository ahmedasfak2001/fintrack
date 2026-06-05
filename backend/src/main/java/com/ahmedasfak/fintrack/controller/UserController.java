package com.ahmedasfak.fintrack.controller;

import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.service.UserService;
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
}