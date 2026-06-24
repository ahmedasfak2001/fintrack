package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class UserProfileResponse {

    private String name;
    private String email;
    private BigDecimal monthlyBudget;
    private boolean enabled;

    public UserProfileResponse(
            String name,
            String email,
            BigDecimal monthlyBudget,
            boolean enabled) {

        this.name = name;
        this.email = email;
        this.monthlyBudget = monthlyBudget;
        this.enabled = enabled;
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

    public boolean isEnabled() {
        return enabled;
    }
}