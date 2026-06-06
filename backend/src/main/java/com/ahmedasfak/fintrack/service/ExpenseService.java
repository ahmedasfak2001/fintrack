package com.ahmedasfak.fintrack.service;

import java.util.List;

import com.ahmedasfak.fintrack.dto.ExpenseResponse;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ahmedasfak.fintrack.dto.AddExpenseRequest;
import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.ExpenseRepository;
import com.ahmedasfak.fintrack.repository.UserRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    // Constructor Injection
    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }
    // Add Expense
    public String addExpense(
            AddExpenseRequest request,
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();

        expense.setUser(user);
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());

        expenseRepository.save(expense);

        return "Expense added successfully";
    }

    // Get Expenses
    public List<ExpenseResponse> getExpenses(
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findByUser(user);

        return expenses.stream()
                .map(expense -> {

                    ExpenseResponse response = new ExpenseResponse();

                    response.setId(expense.getId());
                    response.setAmount(expense.getAmount());
                    response.setCategory(expense.getCategory());
                    response.setDescription(expense.getDescription());
                    response.setExpenseDate(expense.getExpenseDate());

                    return response;
                })
                .toList();
    }
}