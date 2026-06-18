package com.ahmedasfak.fintrack.dto;

import java.math.BigDecimal;

public class DailyAverageResponse {

    private BigDecimal dailyAverage;

    public BigDecimal getDailyAverage() {
        return dailyAverage;
    }

    public void setDailyAverage(
            BigDecimal dailyAverage) {

        this.dailyAverage =
                dailyAverage;
    }
}