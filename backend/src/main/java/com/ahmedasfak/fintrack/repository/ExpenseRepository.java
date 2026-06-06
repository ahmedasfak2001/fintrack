package com.ahmedasfak.fintrack.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    List<Expense> findByUser(User user);
}