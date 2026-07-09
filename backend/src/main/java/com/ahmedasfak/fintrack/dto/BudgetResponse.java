package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class BudgetResponse {

    private BigDecimal budget;

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}