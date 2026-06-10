package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class MonthlyComparisonResponse {

    private BigDecimal currentMonthExpense;

    private BigDecimal previousMonthExpense;

    private double percentageChange;

    public BigDecimal getCurrentMonthExpense() {
        return currentMonthExpense;
    }

    public void setCurrentMonthExpense(
            BigDecimal currentMonthExpense) {

        this.currentMonthExpense =
                currentMonthExpense;
    }

    public BigDecimal getPreviousMonthExpense() {
        return previousMonthExpense;
    }

    public void setPreviousMonthExpense(
            BigDecimal previousMonthExpense) {

        this.previousMonthExpense =
                previousMonthExpense;
    }

    public double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(
            double percentageChange) {

        this.percentageChange =
                percentageChange;
    }
}