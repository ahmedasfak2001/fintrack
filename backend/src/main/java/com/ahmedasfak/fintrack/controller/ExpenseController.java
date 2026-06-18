package com.ahmedasfak.fintrack.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.io.IOException;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.ahmedasfak.fintrack.dto.UpdateExpenseRequest;
import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.ExpenseCategory;
import com.ahmedasfak.fintrack.dto.ExpenseResponse;
import com.ahmedasfak.fintrack.dto.MonthlyComparisonResponse;
import com.ahmedasfak.fintrack.dto.SummaryResponse;
import com.ahmedasfak.fintrack.dto.UpdateBudgetRequest;
import com.ahmedasfak.fintrack.dto.AddExpenseRequest;
import com.ahmedasfak.fintrack.dto.BiggestExpenseResponse;
import com.ahmedasfak.fintrack.dto.BudgetResponse;
import com.ahmedasfak.fintrack.dto.BudgetSummaryResponse;
import com.ahmedasfak.fintrack.dto.DailyAverageResponse;
import com.ahmedasfak.fintrack.service.ExpenseService;
import com.ahmedasfak.fintrack.dto.MonthlySummaryResponse;
import com.ahmedasfak.fintrack.dto.MonthlyTrendResponse;
import com.ahmedasfak.fintrack.dto.SavingsPotentialResponse;
import com.ahmedasfak.fintrack.dto.SpendingInsightResponse;

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
        // @GetMapping
        // public List<ExpenseResponse> getExpenses(
        // @AuthenticationPrincipal UserDetails userDetails) {

        // return expenseService.getExpenses(userDetails);
        // }
        // Get Expenses with Pagination Endpoint and Optional Category Filter
        @GetMapping
        public Page<Expense> getExpenses(

                        @AuthenticationPrincipal UserDetails userDetails,

                        @RequestParam(defaultValue = "0") int page,

                        @RequestParam(defaultValue = "100") int size,

                        @RequestParam(required = false) ExpenseCategory category,

                        @RequestParam(required = false) String search) {

                return expenseService.getExpenses(
                                userDetails,
                                page,
                                size,
                                category,
                                search);
        }

        // Delete Expense Endpoint
        @DeleteMapping("/{id}")
        public String deleteExpense(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.deleteExpense(id, userDetails);
        }

        // Get Summary Endpoint
        @GetMapping("/summary")
        public SummaryResponse getSummary(
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.getSummary(userDetails);
        }

        // Get Monthly Summary Endpoint
        @GetMapping("/summary/monthly")
        public MonthlySummaryResponse getMonthlySummary(
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.getMonthlySummary(userDetails);
        }

        // Get Monthly Trend Endpoint
        @GetMapping("/summary/trend")
        public List<MonthlyTrendResponse> getMonthlyTrend(
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getMonthlyTrend(userDetails);
        }

        // Update Expense Endpoint
        @PutMapping("/{expenseId}")
        public String updateExpense(
                        @PathVariable UUID expenseId,
                        @RequestBody UpdateExpenseRequest request,
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.updateExpense(
                                expenseId,
                                request,
                                userDetails);
        }

        // Get Expenses by Category Endpoint
        @GetMapping("/filter")
        public List<Expense> getExpensesByCategory(
                        @RequestParam ExpenseCategory category,
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.getExpensesByCategory(
                                category,
                                userDetails);
        }

        // Get Expenses by Month Endpoint
        @GetMapping("/filter/month")
        public List<Expense> getExpensesByMonth(
                        @RequestParam int month,
                        @RequestParam int year,
                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.getExpensesByMonth(
                                month,
                                year,
                                userDetails);
        }

        // Get Expenses by Date Range Endpoint
        @GetMapping("/filter/date")
        public List<Expense> getExpensesByDateRange(

                        @RequestParam LocalDate from,

                        @RequestParam LocalDate to,

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService.getExpensesByDateRange(
                                from,
                                to,
                                userDetails);
        }

        // Export Expenses to CSV Endpoint
        @GetMapping("/export")
        public ResponseEntity<String> exportExpenses(

                        @AuthenticationPrincipal UserDetails userDetails)

                        throws IOException {

                String csvData = expenseService.exportExpensesToCsv(
                                userDetails);

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=expenses.csv")
                                // .contentType(MediaType.TEXT_PLAIN)
                                // .contentType(MediaType.TEXT_CSV)
                                .contentType(
                                                MediaType.parseMediaType("text/csv"))
                                .body(csvData);
        }

        // Get Expense Categories Endpoint
        @GetMapping("/categories")
        public ExpenseCategory[] getCategories() {

                return ExpenseCategory.values();
        }

        // Get Budget Summary Endpoint
        @GetMapping("/budget-summary")
        public BudgetSummaryResponse getBudgetSummary(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getBudgetSummary(
                                                userDetails);
        }

        // Get Budget Endpoint
        @GetMapping("/budget")
        public BudgetResponse getBudget(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getUserBudget(
                                                userDetails);
        }

        // Update Budget Endpoint
        @PutMapping("/budget")
        public String updateBudget(

                        @RequestBody UpdateBudgetRequest request,

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .updateUserBudget(
                                                request,
                                                userDetails);
        }

        // Get Monthly Comparison Endpoint
        @GetMapping("/comparison")
        public MonthlyComparisonResponse getMonthlyComparison(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getMonthlyComparison(
                                                userDetails);
        }

        // Get Daily Average Endpoint
        @GetMapping("/daily-average")
        public DailyAverageResponse getDailyAverage(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getDailyAverage(
                                                userDetails);
        }

        // Get Spending Insight Endpoint
        @GetMapping("/spending-insight")
        public SpendingInsightResponse getSpendingInsight(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getSpendingInsight(
                                                userDetails);
        }

        // Get Biggest Expense Endpoint
        @GetMapping("/biggest-expense")
        public BiggestExpenseResponse getBiggestExpense(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getBiggestExpense(
                                                userDetails);
        }

        // Get Potential Savings Endpoint
        @GetMapping("/savings-potential")
        public SavingsPotentialResponse getSavingsPotential(

                        @AuthenticationPrincipal UserDetails userDetails) {

                return expenseService
                                .getSavingsPotential(
                                                userDetails);
        }
}