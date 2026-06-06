package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.ahmedasfak.fintrack.entity.ExpenseCategory;

public class ExpenseResponse {

    private UUID id;
    private BigDecimal amount;
    private ExpenseCategory category;
    private String description;
    private LocalDate expenseDate;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }
}