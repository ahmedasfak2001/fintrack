package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class UpdateBudgetRequest {

    private Integer month;

    private Integer year;

    private BigDecimal budget;

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}