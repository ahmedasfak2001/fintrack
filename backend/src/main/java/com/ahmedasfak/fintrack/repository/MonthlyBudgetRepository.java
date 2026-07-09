package com.ahmedasfak.fintrack.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ahmedasfak.fintrack.entity.MonthlyBudget;
import com.ahmedasfak.fintrack.entity.User;

public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, UUID> {
    Optional<MonthlyBudget> findByUserAndMonthAndYear(
        User user,
        Integer month,
        Integer year);
}
