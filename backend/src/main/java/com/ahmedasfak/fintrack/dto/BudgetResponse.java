package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class BudgetResponse {

    private BigDecimal monthlyBudget;

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(
            BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }
}