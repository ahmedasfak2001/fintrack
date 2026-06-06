package com.ahmedasfak.fintrack.controller;

import java.util.List;

import com.ahmedasfak.fintrack.dto.ExpenseResponse;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.ahmedasfak.fintrack.dto.AddExpenseRequest;
import com.ahmedasfak.fintrack.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }
    // Add Expense Endpoint
    @PostMapping
    public String addExpense(
            @RequestBody AddExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return expenseService.addExpense(request, userDetails);
    }
    // Get Expenses Endpoint
    @GetMapping
    public List<ExpenseResponse> getExpenses(
            @AuthenticationPrincipal UserDetails userDetails) {

        return expenseService.getExpenses(userDetails);
    }
}