package com.ahmedasfak.fintrack.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}