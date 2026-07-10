package com.ahmedasfak.fintrack.service;

import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDate;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.io.StringWriter;
import java.io.IOException;

import java.io.ByteArrayOutputStream;

import com.lowagie.text.Element;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import com.ahmedasfak.fintrack.dto.MonthlySummaryResponse;
import com.ahmedasfak.fintrack.dto.SummaryResponse;
import com.ahmedasfak.fintrack.dto.UpdateBudgetRequest;
import com.ahmedasfak.fintrack.dto.ExpenseResponse;
import com.ahmedasfak.fintrack.dto.MonthlyComparisonResponse;
import com.ahmedasfak.fintrack.dto.AddExpenseRequest;
import com.ahmedasfak.fintrack.dto.BiggestExpenseResponse;
import com.ahmedasfak.fintrack.dto.BudgetResponse;
import com.ahmedasfak.fintrack.dto.BudgetSummaryResponse;
import com.ahmedasfak.fintrack.dto.DailyAverageResponse;
import com.ahmedasfak.fintrack.entity.Expense;
import com.ahmedasfak.fintrack.entity.ExpenseCategory;
import com.ahmedasfak.fintrack.entity.MonthlyBudget;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.ExpenseRepository;
import com.ahmedasfak.fintrack.repository.MonthlyBudgetRepository;
import com.ahmedasfak.fintrack.repository.UserRepository;
import com.lowagie.text.pdf.PdfWriter;
import com.ahmedasfak.fintrack.dto.UpdateExpenseRequest;
import com.ahmedasfak.fintrack.dto.MonthlyTrendResponse;
import com.ahmedasfak.fintrack.dto.SavingsPotentialResponse;
import com.ahmedasfak.fintrack.dto.SpendingInsightResponse;

@Service
public class ExpenseService {

        private final ExpenseRepository expenseRepository;
        private final UserRepository userRepository;
        private final MonthlyBudgetRepository monthlyBudgetRepository;

        public ExpenseService(
                        ExpenseRepository expenseRepository,
                        UserRepository userRepository,
                        MonthlyBudgetRepository monthlyBudgetRepository) {

                this.expenseRepository = expenseRepository;
                this.userRepository = userRepository;
                this.monthlyBudgetRepository = monthlyBudgetRepository;
        }

        // Constructor Injection
        // public ExpenseService(
        // ExpenseRepository expenseRepository,
        // UserRepository userRepository) {

        // this.expenseRepository = expenseRepository;
        // this.userRepository = userRepository;
        // }

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

                LocalDate today = LocalDate.now();

                List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(
                                user,
                                today.withDayOfMonth(1),
                                today.withDayOfMonth(today.lengthOfMonth()));

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

        // Get Monthly Trend
        public List<MonthlyTrendResponse> getMonthlyTrend(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException("User not found"));

                LocalDate now = LocalDate.now();

                return expenseRepository.getMonthlyTrend(
                                user,
                                now.getMonthValue(),
                                now.getYear());
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

        // Get Expenses by Month
        public Page<Expense> getExpensesByMonth(
                        int month,
                        int year,
                        UserDetails userDetails,
                        Pageable pageable) {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                YearMonth yearMonth = YearMonth.of(year, month);

                LocalDate startDate = yearMonth.atDay(1);

                LocalDate endDate = yearMonth.atEndOfMonth();

                return expenseRepository
                                .findByUserAndExpenseDateBetween(
                                                user,
                                                startDate,
                                                endDate,
                                                pageable);
        }

        // Get Expenses with Pagination and Optional Category Filter and Search
        // public Page<Expense> getExpenses(
        // UserDetails userDetails,
        // int page,
        // int size,
        // ExpenseCategory category,
        // String search,
        // Integer month,
        // Integer year) {

        // User user = userRepository
        // .findByEmail(userDetails.getUsername())
        // .orElseThrow(() -> new RuntimeException("User not found"));
        // if (month == null || year == null) {
        // LocalDate today = LocalDate.now();

        // month = today.getMonthValue();
        // year = today.getYear();
        // }

        // YearMonth yearMonth = YearMonth.of(year, month);

        // LocalDate startDate = yearMonth.atDay(1);
        // LocalDate endDate = yearMonth.atEndOfMonth();
        // Pageable pageable = PageRequest.of(
        // page,
        // size,
        // Sort.by("createdAt").descending());

        // if (search != null &&
        // !search.isBlank()) {

        // return expenseRepository
        // .findByUserAndDescriptionContainingIgnoreCase(
        // user,
        // search,
        // pageable);
        // }

        // if (category != null) {

        // return expenseRepository
        // .findByUserAndCategory(
        // user,
        // category,
        // pageable);
        // }

        // return expenseRepository
        // .findByUser(
        // user,
        // pageable);
        // }
        public Page<Expense> getExpenses(
                        UserDetails userDetails,
                        int page,
                        int size,
                        ExpenseCategory category,
                        String search,
                        Integer month,
                        Integer year) {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by("expenseDate").descending());

                if (month == null || year == null) {
                        LocalDate today = LocalDate.now();
                        month = today.getMonthValue();
                        year = today.getYear();
                }

                LocalDate startDate = LocalDate.of(year, month, 1);
                LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

                if (category != null) {
                        return expenseRepository.findByUserAndCategoryAndExpenseDateBetween(
                                        user,
                                        category,
                                        startDate,
                                        endDate,
                                        pageable);
                }

                if (search != null && !search.isBlank()) {
                        return expenseRepository
                                        .findByUserAndDescriptionContainingIgnoreCaseAndExpenseDateBetween(
                                                        user,
                                                        search,
                                                        startDate,
                                                        endDate,
                                                        pageable);
                }

                return expenseRepository.findByUserAndExpenseDateBetween(
                                user,
                                startDate,
                                endDate,
                                pageable);
        }

        // Get Expenses by Date Range
        public Page<Expense> getExpensesByDateRange(
                        LocalDate from,
                        LocalDate to,
                        UserDetails userDetails,
                        Pageable pageable) {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return expenseRepository
                                .findByUserAndExpenseDateBetween(
                                                user,
                                                from,
                                                to,
                                                pageable);
        }

        // Export Expenses to CSV
        public String exportExpensesToCsv(
                        UserDetails userDetails) throws IOException {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                StringWriter writer = new StringWriter();

                CSVPrinter csvPrinter = new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                                .setHeader(
                                                                "Date",
                                                                "Category",
                                                                "Amount",
                                                                "Description")
                                                .build());

                for (Expense expense : expenses) {

                        csvPrinter.printRecord(
                                        expense.getExpenseDate(),
                                        expense.getCategory(),
                                        expense.getAmount(),
                                        expense.getDescription());
                }

                csvPrinter.flush();

                return writer.toString();
        }

        // Get Budget Summary
        public BudgetSummaryResponse getBudgetSummary(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                YearMonth currentMonth = YearMonth.now();

                List<Expense> expenses = expenseRepository.findByUser(user);

                BigDecimal spent = expenses.stream()
                                .filter(expense -> YearMonth.from(
                                                expense.getExpenseDate())
                                                .equals(currentMonth))
                                .map(Expense::getAmount)
                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                // BigDecimal budget = BigDecimal.valueOf(25000);
                BigDecimal budget = user.getMonthlyBudget();

                BigDecimal remaining = budget.subtract(spent);

                double usagePercentage = spent.doubleValue()
                                / budget.doubleValue()
                                * 100;

                BudgetSummaryResponse response = new BudgetSummaryResponse();

                response.setBudget(budget);
                response.setSpent(spent);
                response.setRemaining(remaining);
                response.setUsagePercentage(
                                usagePercentage);

                return response;
        }

        // Get User Budget
        public BudgetResponse getUserBudget(
                        Integer month,
                        Integer year,
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                Optional<MonthlyBudget> optionalBudget = monthlyBudgetRepository.findByUserAndMonthAndYear(
                                user,
                                month,
                                year);

                BudgetResponse response = new BudgetResponse();

                if (optionalBudget.isPresent()) {

                        response.setBudget(
                                        optionalBudget.get().getBudget());

                } else {

                        response.setBudget(BigDecimal.ZERO);

                }

                return response;
        }

        // Update User Budget
        // public String updateUserBudget(
        // UpdateBudgetRequest request,
        // UserDetails userDetails) {

        // User user = userRepository
        // .findByEmail(
        // userDetails.getUsername())
        // .orElseThrow(
        // () -> new RuntimeException(
        // "User not found"));

        // user.setMonthlyBudget(
        // request.getMonthlyBudget());

        // userRepository.save(user);

        // return "Budget updated successfully";
        // }
        public String updateUserBudget(
                        UpdateBudgetRequest request,
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Optional<MonthlyBudget> optionalBudget = monthlyBudgetRepository.findByUserAndMonthAndYear(
                                user,
                                request.getMonth(),
                                request.getYear());

                if (optionalBudget.isPresent()) {

                        MonthlyBudget monthlyBudget = optionalBudget.get();

                        monthlyBudget.setBudget(request.getBudget());

                        monthlyBudgetRepository.save(monthlyBudget);

                        return "Budget updated successfully";
                }

                MonthlyBudget monthlyBudget = new MonthlyBudget();

                monthlyBudget.setUser(user);
                monthlyBudget.setMonth(request.getMonth());
                monthlyBudget.setYear(request.getYear());
                monthlyBudget.setBudget(request.getBudget());

                monthlyBudgetRepository.save(monthlyBudget);

                return "Budget saved successfully";
        }

        // Get Monthly Comparison
        public MonthlyComparisonResponse getMonthlyComparison(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                YearMonth currentMonth = YearMonth.now();

                YearMonth previousMonth = currentMonth.minusMonths(1);

                BigDecimal currentTotal = expenses.stream()
                                .filter(expense -> YearMonth.from(
                                                expense.getExpenseDate())
                                                .equals(currentMonth))
                                .map(Expense::getAmount)
                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                BigDecimal previousTotal = expenses.stream()
                                .filter(expense -> YearMonth.from(
                                                expense.getExpenseDate())
                                                .equals(previousMonth))
                                .map(Expense::getAmount)
                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                double percentageChange = 0;

                if (previousTotal.compareTo(
                                BigDecimal.ZERO) > 0) {

                        percentageChange = currentTotal
                                        .subtract(previousTotal)
                                        .divide(
                                                        previousTotal,
                                                        4,
                                                        RoundingMode.HALF_UP)
                                        .multiply(
                                                        BigDecimal.valueOf(
                                                                        100))
                                        .doubleValue();
                }

                MonthlyComparisonResponse response = new MonthlyComparisonResponse();

                response.setCurrentMonthExpense(
                                currentTotal);

                response.setPreviousMonthExpense(
                                previousTotal);

                response.setPercentageChange(
                                percentageChange);

                return response;
        }

        // Get Daily Average
        public DailyAverageResponse getDailyAverage(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                List<Expense> expenses = expenseRepository.findByUser(user);

                YearMonth currentMonth = YearMonth.now();

                BigDecimal monthlyTotal = expenses.stream()
                                .filter(expense -> YearMonth.from(
                                                expense.getExpenseDate())
                                                .equals(currentMonth))
                                .map(Expense::getAmount)
                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                int currentDay = LocalDate.now().getDayOfMonth();

                BigDecimal average = currentDay > 0
                                ? monthlyTotal.divide(
                                                BigDecimal.valueOf(
                                                                currentDay),
                                                2,
                                                RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                DailyAverageResponse response = new DailyAverageResponse();

                response.setDailyAverage(
                                average);

                return response;
        }

        // Get Spending Insight
        public SpendingInsightResponse getSpendingInsight(
                        UserDetails userDetails) {

                MonthlyComparisonResponse comparison = getMonthlyComparison(
                                userDetails);

                SpendingInsightResponse response = new SpendingInsightResponse();

                if (comparison.getPreviousMonthExpense()
                                .compareTo(BigDecimal.ZERO) == 0) {

                        response.setMessage(
                                        "No comparison data available yet.");

                        return response;
                }

                double change = comparison.getPercentageChange();

                if (change > 0) {

                        response.setMessage(
                                        String.format(
                                                        "📈 You are spending %.2f%% more than last month.",
                                                        change));

                } else if (change < 0) {

                        response.setMessage(
                                        String.format(
                                                        "✅ Great job! You reduced spending by %.2f%% compared to last month.",
                                                        Math.abs(change)));

                } else {

                        response.setMessage(
                                        "ℹ️ Spending is exactly the same as last month.");
                }

                return response;
        }

        // Get Biggest Expense of the Month
        public BiggestExpenseResponse getBiggestExpense(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                YearMonth currentMonth = YearMonth.now();

                List<Expense> monthlyExpenses = expenseRepository.findByUser(user)
                                .stream()
                                .filter(expense -> YearMonth.from(
                                                expense.getExpenseDate())
                                                .equals(currentMonth))
                                .toList();

                BiggestExpenseResponse response = new BiggestExpenseResponse();

                monthlyExpenses.stream()
                                .max((a, b) -> a.getAmount()
                                                .compareTo(
                                                                b.getAmount()))
                                .ifPresent(expense -> {

                                        response.setAmount(
                                                        expense.getAmount());

                                        response.setDescription(
                                                        expense.getDescription());

                                        response.setCategory(
                                                        expense.getCategory()
                                                                        .name());
                                });

                return response;
        }

        // Get potential savings
        public SavingsPotentialResponse getSavingsPotential(
                        UserDetails userDetails) {

                User user = userRepository
                                .findByEmail(
                                                userDetails.getUsername())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                MonthlySummaryResponse summary = getMonthlySummary(
                                userDetails);

                BigDecimal budget = user.getMonthlyBudget();

                BigDecimal spent = summary.getTotalExpense();

                BigDecimal remaining = budget.subtract(spent);

                SavingsPotentialResponse response = new SavingsPotentialResponse();

                if (remaining.compareTo(
                                BigDecimal.ZERO) > 0) {

                        response.setAmount(
                                        remaining);

                        response.setMessage(
                                        "You can still save");

                } else {

                        response.setAmount(
                                        BigDecimal.ZERO);

                        response.setMessage(
                                        "Budget already exceeded");
                }

                return response;
        }

        public byte[] exportMonthlyReportPdf(
                        UserDetails userDetails,
                        int month,
                        int year) throws Exception {

                User user = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                YearMonth ym = YearMonth.of(year, month);

                LocalDate startDate = ym.atDay(1);
                LocalDate endDate = ym.atEndOfMonth();

                List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(
                                user,
                                startDate,
                                endDate);

                Font titleFont = FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                20);

                Font headingFont = FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                12);

                Font normalFont = FontFactory.getFont(
                                FontFactory.HELVETICA,
                                11);
                Document document = new Document();

                ByteArrayOutputStream out = new ByteArrayOutputStream();

                PdfWriter.getInstance(document, out);
                BigDecimal totalExpense = expenses.stream()
                                .map(Expense::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                document.open();

                ClassPathResource resource = new ClassPathResource("static/logo.png");

                Image logo = Image.getInstance(resource.getInputStream().readAllBytes());

                logo.scaleToFit(70, 70);

                logo.setAlignment(Image.ALIGN_CENTER);
                document.add(logo);

                document.add(new Paragraph(" "));

                Paragraph title = new Paragraph(
                                "FinTrack Monthly Expense Report",
                                titleFont);

                title.setAlignment(Element.ALIGN_CENTER);

                document.add(title);

                document.add(new Paragraph(" "));

                document.add(new Paragraph(
                                "Month : " + ym.getMonth() + " " + year,
                                normalFont));

                document.add(new Paragraph(
                                "Generated On : " + LocalDate.now(),
                                normalFont));

                PdfPTable table = new PdfPTable(4);

                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                table.setSpacingAfter(10f);

                table.setWidths(new float[] {
                                2f,
                                2f,
                                5f,
                                2f
                });
                PdfPCell dateHeader = new PdfPCell(new Phrase("Date", headingFont));

                PdfPCell categoryHeader = new PdfPCell(new Phrase("Category", headingFont));

                PdfPCell descriptionHeader = new PdfPCell(new Phrase("Description", headingFont));

                PdfPCell amountHeader = new PdfPCell(new Phrase("Amount", headingFont));

                table.addCell(dateHeader);
                table.addCell(categoryHeader);
                table.addCell(descriptionHeader);
                table.addCell(amountHeader);

                for (Expense expense : expenses) {

                        table.addCell(expense.getExpenseDate().toString());

                        table.addCell(expense.getCategory().name());

                        table.addCell(expense.getDescription());

                        PdfPCell amountCell = new PdfPCell(
                                        new Phrase(
                                                        "₹ " + expense.getAmount(),
                                                        normalFont));

                        amountCell.setHorizontalAlignment(
                                        Element.ALIGN_RIGHT);

                        table.addCell(amountCell);
                }

                document.add(table);

                document.add(new Paragraph(
                                "Total Transactions : " + expenses.size(),
                                normalFont));

                document.add(new Paragraph(
                                "Total Expense : ₹" + totalExpense,
                                normalFont));

                document.add(new Paragraph(" "));

                Paragraph footer = new Paragraph(
                                "Generated by FinTrack",
                                normalFont);

                footer.setAlignment(Element.ALIGN_CENTER);

                document.add(footer);
                document.close();

                return out.toByteArray();

        }
}