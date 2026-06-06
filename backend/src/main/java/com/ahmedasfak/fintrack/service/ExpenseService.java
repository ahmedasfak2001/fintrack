package com.ahmedasfak.fintrack.service;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ahmedasfak.fintrack.dto.MonthlySummaryResponse;
import com.ahmedasfak.fintrack.dto.SummaryResponse;
import com.ahmedasfak.fintrack.dto.ExpenseResponse;
import com.ahmedasfak.fintrack.dto.AddExpenseRequest;
import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.ExpenseCategory;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.ExpenseRepository;
import com.ahmedasfak.fintrack.repository.UserRepository;
import com.ahmedasfak.fintrack.dto.UpdateExpenseRequest;

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

    // Delete Expense
    public String deleteExpense(
            UUID expenseId,
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository
                .findByIdAndUser(expenseId, user)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);

        return "Expense deleted successfully";
    }

    // Get Summary
    public SummaryResponse getSummary(
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findByUser(user);

        SummaryResponse response = new SummaryResponse();

        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();

        for (Expense expense : expenses) {

            String category = expense.getCategory().name();

            categoryBreakdown.put(
                    category,
                    categoryBreakdown.getOrDefault(
                            category,
                            BigDecimal.ZERO)
                            .add(expense.getAmount()));
        }

        response.setTotalExpense(totalExpense);
        response.setExpenseCount((long) expenses.size());
        response.setCategoryBreakdown(categoryBreakdown);

        return response;
    }

    // Get Monthly Summary
    public MonthlySummaryResponse getMonthlySummary(
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Expense> expenses = expenseRepository.findByUser(user);

        YearMonth currentMonth = YearMonth.now();

        List<Expense> monthlyExpenses = expenses.stream()
                .filter(expense -> YearMonth.from(expense.getExpenseDate())
                        .equals(currentMonth))
                .toList();

        BigDecimal totalExpense = monthlyExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();

        for (Expense expense : monthlyExpenses) {

            String category = expense.getCategory().name();

            categoryBreakdown.put(
                    category,
                    categoryBreakdown.getOrDefault(
                            category,
                            BigDecimal.ZERO)
                            .add(expense.getAmount()));
        }

        MonthlySummaryResponse response = new MonthlySummaryResponse();

        response.setMonth(currentMonth.getMonth().name());
        response.setYear(currentMonth.getYear());
        response.setTotalExpense(totalExpense);
        response.setExpenseCount((long) monthlyExpenses.size());
        response.setCategoryBreakdown(categoryBreakdown);

        return response;
    }

    // Update Expense
    public String updateExpense(
            UUID expenseId,
            UpdateExpenseRequest request,
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = expenseRepository
                .findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());

        expenseRepository.save(expense);

        return "Expense updated successfully";
    }
    // Get Expenses by Category
    public List<Expense> getExpensesByCategory(
            ExpenseCategory category,
            UserDetails userDetails) {

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return expenseRepository
                .findByUserAndCategory(user, category);
    }
}