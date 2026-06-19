package com.ahmedasfak.fintrack.dto;

public class AuthResponse {

    private String token;
    private String name;

    public AuthResponse(String token, String name) {
        this.token = token;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }
}