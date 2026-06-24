package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class UserProfileResponse {

    private String name;
    private String email;
    private BigDecimal monthlyBudget;

    public UserProfileResponse(
            String name,
            String email,
            BigDecimal monthlyBudget) {

        this.name = name;
        this.email = email;
        this.monthlyBudget = monthlyBudget;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }
}