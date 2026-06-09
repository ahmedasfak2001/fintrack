package com.ahmedasfak.fintrack.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedasfak.fintrack.dto.MonthlyTrendResponse;
import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.ExpenseCategory;
import com.ahmedasfak.fintrack.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    List<Expense> findByUser(User user);

    Optional<Expense> findByIdAndUser(UUID id, User user);

    List<Expense> findByUserAndCategory(
            User user,
            ExpenseCategory category);

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate);

    Page<Expense> findByUser(
            User user,
            Pageable pageable);

    Page<Expense> findByUserAndCategory(
            User user,
            ExpenseCategory category,
            Pageable pageable);

    Page<Expense> findByUserAndDescriptionContainingIgnoreCase(
            User user,
            String description,
            Pageable pageable);

    @Query("""
            SELECT new com.ahmedasfak.fintrack.dto.MonthlyTrendResponse(
                CAST(e.expenseDate AS string),
                SUM(e.amount)
            )
            FROM Expense e
            WHERE e.user = :user
            AND MONTH(e.expenseDate) = :month
            AND YEAR(e.expenseDate) = :year
            GROUP BY e.expenseDate
            ORDER BY e.expenseDate
            """)
    List<MonthlyTrendResponse> getMonthlyTrend(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);
}