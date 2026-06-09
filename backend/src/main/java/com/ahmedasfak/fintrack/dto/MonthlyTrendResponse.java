package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class MonthlyTrendResponse {

    private String date;
    private BigDecimal total;

    public MonthlyTrendResponse(
            String date,
            BigDecimal total) {

        this.date = date;
        this.total = total;
    }

    public String getDate() {
        return date;
    }

    public BigDecimal getTotal() {
        return total;
    }
}