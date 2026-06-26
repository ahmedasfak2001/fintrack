package com.ahmedasfak.fintrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/health")
    public String test() {
        return "Monitor is Up and running...";
    }
}