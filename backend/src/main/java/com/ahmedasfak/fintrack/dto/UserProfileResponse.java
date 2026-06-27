package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserProfileResponse {

    private String name;
    private String email;
    private BigDecimal monthlyBudget;
    private boolean enabled;
    private BigDecimal currentExpense;
    private LocalDateTime createdAt;

    public UserProfileResponse(
            String name,
            String email,
            BigDecimal monthlyBudget,
            boolean enabled,
            BigDecimal currentExpense,
            LocalDateTime createdAt) {

        this.name = name;
        this.email = email;
        this.monthlyBudget = monthlyBudget;
        this.enabled = enabled;
        this.currentExpense = currentExpense;
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

    public BigDecimal getCurrentExpense() {
        return currentExpense;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}