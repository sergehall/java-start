import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Locale;

public class ExpenseManager {
    private ArrayList<Expense> expenses;

    public ExpenseManager() {
        expenses = new ArrayList<>();
    }

    public void addExpense(Expense expense) {
        if (expense == null) {
            throw new IllegalArgumentException("Expense cannot be null.");
        }
        expenses.add(expense);
    }

    public void displayExpenses() {
        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded.");
            return;
        }

        System.out.println("\nAll Expenses:");
        for (Expense expense : expenses) {
            System.out.println(expense);
        }
    }

    public double calculateTotalExpenses() {
        double total = 0.0;

        for (Expense expense : expenses) {
            total += expense.getAmount();
        }

        return total;
    }

    public double calculateTotalExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);

        double total = 0.0;

        for (Expense expense : expenses) {
            if (isInDateRange(expense, startDate, endDate)) {
                total += expense.getAmount();
            }
        }

        return total;
    }

    public void displayTotalExpenses() {
        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded.");
        }
        System.out.printf(Locale.US, "Total Expenses: $%.2f%n", calculateTotalExpenses());
    }

    public void displayExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        validateDateRange(startDate, endDate);

        if (expenses.isEmpty()) {
            System.out.println("No expenses recorded.");
            return;
        }

        System.out.println("\nExpenses from " + startDate + " to " + endDate + ":");

        boolean foundExpense = false;
        for (Expense expense : expenses) {
            if (isInDateRange(expense, startDate, endDate)) {
                System.out.println(expense);
                foundExpense = true;
            }
        }

        if (!foundExpense) {
            System.out.println("No expenses found in this date range.");
        }

        System.out.printf(Locale.US, "Total: $%.2f%n", calculateTotalExpensesByDateRange(startDate, endDate));
    }

    private boolean isInDateRange(Expense expense, LocalDate startDate, LocalDate endDate) {
        LocalDate expenseDate = expense.getDate();
        return !expenseDate.isBefore(startDate) && !expenseDate.isAfter(endDate);
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null.");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }
    }
}
