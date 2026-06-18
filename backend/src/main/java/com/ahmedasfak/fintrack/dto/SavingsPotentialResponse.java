package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class SavingsPotentialResponse {

    private String message;

    private BigDecimal amount;

    public String getMessage() {
        return message;
    }

    public void setMessage(
            String message) {

        this.message = message;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(
            BigDecimal amount) {

        this.amount = amount;
    }
}