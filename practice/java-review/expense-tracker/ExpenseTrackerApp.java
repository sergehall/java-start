import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class ExpenseTrackerApp {
    private static final int MIN_MENU_CHOICE = 1;
    private static final int MAX_MENU_CHOICE = 5;

    public static void main(String[] args) {
        ExpenseManager manager = new ExpenseManager();
        boolean running = true;

        try (Scanner scanner = new Scanner(System.in)) {
            while (running) {
                printMenu();
                int choice = readMenuChoice(scanner);

                switch (choice) {
                    case 1:
                        addExpense(scanner, manager);
                        break;
                    case 2:
                        manager.displayExpenses();
                        break;
                    case 3:
                        manager.displayTotalExpenses();
                        break;
                    case 4:
                        displayExpensesForDateRange(scanner, manager);
                        break;
                    case 5:
                        running = false;
                        System.out.println("Goodbye!");
                        break;
                    default:
                        System.out.println("Please choose a valid menu option.");
                        break;
                }
            }
        }
    }

    private static void addExpense(Scanner scanner, ExpenseManager manager) {
        try {
            Expense expense = readExpense(scanner);
            manager.addExpense(expense);
            System.out.println("Expense added successfully.");
        } catch (IllegalArgumentException exception) {
            System.out.println("Could not add expense: " + exception.getMessage());
        }
    }

    private static void printMenu() {
        System.out.println("\nExpense Tracker");
        System.out.println("1. Add Expense");
        System.out.println("2. View All Expenses");
        System.out.println("3. View Total Expenses");
        System.out.println("4. View Expenses by Date Range");
        System.out.println("5. Exit");
        System.out.print("Choose an option: ");
    }

    private static Expense readExpense(Scanner scanner) {
        String description = readRequiredText(scanner, "Enter description: ");
        double amount = readDouble(scanner, "Enter amount: ");
        LocalDate date = readDate(scanner, "Enter date (yyyy-MM-dd): ");
        String category = readRequiredText(scanner, "Enter category: ");

        return new Expense(description, amount, date, category);
    }

    private static void displayExpensesForDateRange(Scanner scanner, ExpenseManager manager) {
        while (true) {
            LocalDate startDate = readDate(scanner, "Enter start date (yyyy-MM-dd): ");
            LocalDate endDate = readDate(scanner, "Enter end date (yyyy-MM-dd): ");

            if (startDate.isAfter(endDate)) {
                System.out.println("Start date cannot be after end date. Please try again.");
                continue;
            }

            manager.displayExpensesByDateRange(startDate, endDate);
            return;
        }
    }

    private static int readMenuChoice(Scanner scanner) {
        while (true) {
            String input = scanner.nextLine().trim();

            try {
                int choice = Integer.parseInt(input);
                if (choice >= MIN_MENU_CHOICE && choice <= MAX_MENU_CHOICE) {
                    return choice;
                }
            } catch (NumberFormatException exception) {
                // The message below covers non-numeric and out-of-range values.
            }

            System.out.print("Invalid input. Enter a number from 1 to 5: ");
        }
    }

    private static String readRequiredText(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String text = scanner.nextLine().trim();

            if (!text.isEmpty()) {
                return text;
            }

            System.out.println("Input cannot be blank.");
        }
    }

    private static double readDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();

            try {
                double amount = Double.parseDouble(input);
                if (Double.isNaN(amount) || Double.isInfinite(amount)) {
                    System.out.println("Amount must be a valid number.");
                } else if (amount < 0) {
                    System.out.println("Amount cannot be negative.");
                } else {
                    return amount;
                }
            } catch (NumberFormatException exception) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private static LocalDate readDate(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();

            try {
                return LocalDate.parse(input);
            } catch (DateTimeParseException exception) {
                System.out.println("Invalid date. Use format yyyy-MM-dd.");
            }
        }
    }
}
