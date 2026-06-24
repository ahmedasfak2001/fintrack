package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class UserProfileResponse {

    private String name;
    private String email;
    private BigDecimal monthlyBudget;
    private boolean enabled;
    private BigDecimal currentExpense;

    public UserProfileResponse(
            String name,
            String email,
            BigDecimal monthlyBudget,
            boolean enabled,
            BigDecimal currentExpense) {

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
}