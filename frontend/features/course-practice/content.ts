export type CourseAssignment = Readonly<{
  id: string;
  title: string;
  type: "Assignment" | "Discussion" | "Exam" | "Quiz";
  dueDate: string;
  dueLabel: string;
  summary: string;
  requiredFiles: readonly string[];
  requirements: readonly string[];
  rubric: readonly string[];
  focusAreas: readonly string[];
  starterFiles: readonly CourseAssignmentFile[];
}>;

export type CourseAssignmentFile = Readonly<{
  fileName: string;
  description: string;
  content: string;
}>;

export type CourseModuleItem = Readonly<{
  id: string;
  title: string;
  type: "Assignment" | "Page" | "Quiz";
  href: string;
  dueLabel?: string;
  points?: string;
}>;

export type CourseModuleSection = Readonly<{
  id: string;
  title: string;
  description?: string;
  items: readonly CourseModuleItem[];
}>;

export type CourseModule = Readonly<{
  id: string;
  displayTitle: string;
  isLocked: boolean;
  title: string;
  dateRange: string;
  description: string;
  topics: readonly string[];
  sections: readonly CourseModuleSection[];
  assignments: readonly CourseAssignment[];
}>;

const javaReviewAssignment: CourseAssignment = {
  id: "expense-tracker",
  title: "Assignment: Java Review",
  type: "Assignment",
  dueDate: "2026-06-28",
  dueLabel: "Sun Jun 28, 2026 at 11:59 PM",
  summary:
    "Build a Java 21 console application called Expense Tracker that lets a user add expenses, view all expenses, calculate totals, and filter expenses by date range.",
  requiredFiles: ["Expense.java", "ExpenseManager.java", "ExpenseTrackerApp.java"],
  requirements: [
    "Expense has private description, amount, date, and category fields.",
    "Expense includes constructors, getters, setters, and a useful toString().",
    "ExpenseManager stores Expense objects in an ArrayList.",
    "ExpenseManager can add expenses, display expenses, calculate totals, filter by date range, and calculate a date-range total.",
    "ExpenseTrackerApp provides a text menu for add, view all, total, date range, and exit.",
    "The console UI handles invalid numeric input and invalid LocalDate input without crashing.",
    "The classes stay separated by responsibility and use clear Java naming and indentation."
  ],
  rubric: [
    "Expense class and all required private fields.",
    "Getter and setter methods.",
    "ExpenseManager class with a collection of Expense objects.",
    "addExpense() and displayExpenses() behavior.",
    "Main function with real user interaction.",
    "Coding standards, formatting, indentation, naming, and single responsibility."
  ],
  focusAreas: ["OOP", "Encapsulation", "ArrayList", "LocalDate", "Exception handling", "Console input"],
  starterFiles: [
    {
      fileName: "Expense.java",
      description: "Completed model class for one expense with encapsulation, validation, and readable output.",
      content: `import java.time.LocalDate;
import java.util.Locale;

public class Expense {
    private static final String DEFAULT_DESCRIPTION = "No description";
    private static final String DEFAULT_CATEGORY = "Uncategorized";

    private String description;
    private double amount;
    private LocalDate date;
    private String category;

    public Expense() {
        this.description = DEFAULT_DESCRIPTION;
        this.amount = 0.0;
        this.date = LocalDate.now();
        this.category = DEFAULT_CATEGORY;
    }

    public Expense(String description, double amount, LocalDate date, String category) {
        setDescription(description);
        setAmount(amount);
        setDate(date);
        setCategory(category);
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description cannot be blank.");
        }
        this.description = description.trim();
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        if (Double.isNaN(amount) || Double.isInfinite(amount)) {
            throw new IllegalArgumentException("Amount must be a valid number.");
        }
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative.");
        }
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("Date cannot be null.");
        }
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category cannot be blank.");
        }
        this.category = category.trim();
    }

    @Override
    public String toString() {
        return "Date: " + date
                + ", Category: " + category
                + ", Amount: $" + String.format(Locale.US, "%.2f", amount)
                + ", Description: " + description;
    }
}
`
    },
    {
      fileName: "ExpenseManager.java",
      description: "Completed manager class for storing, displaying, and totaling expenses by date range.",
      content: `import java.time.LocalDate;
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

        System.out.println("\\nAll Expenses:");
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

        System.out.println("\\nExpenses from " + startDate + " to " + endDate + ":");

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
`
    },
    {
      fileName: "ExpenseTrackerApp.java",
      description: "Completed console entry point with menu flow, validated input, and friendly error handling.",
      content: `import java.time.LocalDate;
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
        System.out.println("\\nExpense Tracker");
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
`
    }
  ]
};

const javaReviewSections: readonly CourseModuleSection[] = [
  {
    id: "overview",
    title: "Overview",
    description:
      "A quick orientation for the Java Review module. This section is our reminder of the goal: refresh core Java syntax, rebuild confidence with console programs, and prepare the small building blocks needed for the Expense Tracker assignment.",
    items: []
  },
  {
    id: "setup",
    title: "Setup",
    description:
      "Setup is treated as a local readiness checkpoint. We will keep the project ready in IntelliJ with Java 21, Maven, and a clean folder structure, but we will not duplicate the Canvas setup pages here.",
    items: []
  },
  {
    id: "lecture",
    title: "Lecture",
    description:
      "Lecture work stays in Canvas. Here we will use the lecture sequence as a study map only: basics, arithmetic, conditions, switch, loops, methods, arrays, classes, and objects. The actual practice work happens in the Tasks area below.",
    items: []
  },
  {
    id: "tasks",
    title: "Tasks",
    items: [
      {
        id: "assignment-java-review",
        title: "Assignment: Java Review",
        type: "Assignment",
        href: "https://online.smc.edu/courses/83001/modules/items/5314850",
        dueLabel: "Jun 28",
        points: "20 pts"
      }
    ]
  }
];

export function getJavaReviewAssignmentFile(fileName: string) {
  return javaReviewAssignment.starterFiles.find((file) => file.fileName === fileName) ?? null;
}

export const courseModules: readonly CourseModule[] = [
  {
    id: "getting-started",
    displayTitle: "Getting Started",
    isLocked: false,
    title: "Getting Started",
    dateRange: "Jun 22 - Jun 23",
    description: "Course setup, policy acknowledgement, tooling, and first Canvas checks.",
    topics: ["Canvas setup", "JDK", "Maven", "IntelliJ IDEA"],
    sections: [],
    assignments: []
  },
  {
    id: "java-review",
    displayTitle: "Module: Java Review",
    isLocked: false,
    title: "Java Review",
    dateRange: "Jun 22 - Jun 28",
    description: "Refresh core Java syntax, classes, methods, arrays, conditions, loops, and simple console programs.",
    topics: ["Basic program", "Arithmetic", "Conditions", "Loops", "Methods", "Arrays", "Packages"],
    sections: javaReviewSections,
    assignments: [javaReviewAssignment]
  },
  {
    id: "inheritance",
    displayTitle: "Module: Inheritance",
    isLocked: false,
    title: "Inheritance",
    dateRange: "Jun 22 - Jun 28",
    description: "Practice class hierarchies, constructors, super, access levels, and inherited behavior.",
    topics: ["Inheritance", "Constructors and super", "Access levels"],
    sections: [],
    assignments: []
  },
  {
    id: "polymorphism-dynamic-binding-interfaces",
    displayTitle: "Module: Polymorphism, Dynamic Binding & Interfaces",
    isLocked: false,
    title: "Polymorphism, Dynamic Binding & Interfaces",
    dateRange: "Jun 22 - Jun 28",
    description: "Work with overridden behavior, abstract classes, interfaces, anonymous classes, and dynamic binding.",
    topics: ["Polymorphism", "Dynamic binding", "Interfaces", "Abstract classes", "Anonymous classes"],
    sections: [],
    assignments: []
  },
  {
    id: "uml",
    displayTitle: "Module: Unified Modeling Language",
    isLocked: true,
    title: "Unified Modeling Language",
    dateRange: "Jun 29 - Jul 5",
    description: "Describe classes, relationships, inheritance, and responsibilities before writing code.",
    topics: ["Class diagrams", "Relationships", "Design communication"],
    sections: [],
    assignments: []
  },
  {
    id: "exceptions",
    displayTitle: "Module: Exceptions",
    isLocked: true,
    title: "Exceptions",
    dateRange: "Jun 29 - Jul 5",
    description: "Handle expected failures with clear exception flows and user-safe messages.",
    topics: ["Exception classes", "try-catch", "finally"],
    sections: [],
    assignments: []
  },
  {
    id: "generics",
    displayTitle: "Module: Generics",
    isLocked: true,
    title: "Generics",
    dateRange: "Jul 6 - Jul 12",
    description: "Practice type-safe reusable classes and methods.",
    topics: ["Generic methods", "Bounded parameters", "Wildcards"],
    sections: [],
    assignments: []
  },
  {
    id: "design-patterns",
    displayTitle: "Module: Design Patterns",
    isLocked: true,
    title: "Design Patterns",
    dateRange: "Jul 6 - Jul 12",
    description: "Recognize and implement common object-oriented patterns.",
    topics: ["Iterator", "Singleton", "Template Method"],
    sections: [],
    assignments: []
  },
  {
    id: "midterm",
    displayTitle: "Module: Midterm",
    isLocked: true,
    title: "Midterm",
    dateRange: "Jul 12 - Jul 13",
    description: "Midterm review and exam work for all topics covered so far.",
    topics: ["Review", "Exam practice"],
    sections: [],
    assignments: []
  },
  {
    id: "collections",
    displayTitle: "Module: Collections (Data Structures)",
    isLocked: true,
    title: "Collections (Data Structures)",
    dateRange: "Jul 13 - Jul 19",
    description: "Choose data structures intentionally and implement equality correctly.",
    topics: ["ArrayList", "LinkedList", "Set", "Map", "equals", "hashCode"],
    sections: [],
    assignments: []
  },
  {
    id: "networking",
    displayTitle: "Module: Networking",
    isLocked: true,
    title: "Networking",
    dateRange: "Jul 13 - Jul 19",
    description: "Connect Java programs through basic client-server and web application workflows.",
    topics: ["Client-server", "Web application", "Networking"],
    sections: [],
    assignments: []
  },
  {
    id: "javafx",
    displayTitle: "Module: JavaFX",
    isLocked: true,
    title: "JavaFX",
    dateRange: "Jul 20 - Jul 26",
    description: "Build JavaFX interfaces with layout, UI controls, FXML, and media basics.",
    topics: ["JavaFX", "Layout", "UI controls", "FXML", "Audio"],
    sections: [],
    assignments: []
  },
  {
    id: "event-driven-javafx",
    displayTitle: "Module: Event Driven Programming with Java FX",
    isLocked: true,
    title: "Event Driven Programming with Java FX",
    dateRange: "Jul 20 - Jul 26",
    description: "Respond to JavaFX UI events with clean handlers and state updates.",
    topics: ["Events", "Handlers", "JavaFX state"],
    sections: [],
    assignments: []
  },
  {
    id: "multithreading",
    displayTitle: "Module: Multithreading",
    isLocked: true,
    title: "Multithreading",
    dateRange: "Jul 27 - Jul 31",
    description: "Coordinate concurrent work and synchronize shared state.",
    topics: ["Multithreading", "Synchronization"],
    sections: [],
    assignments: []
  },
  {
    id: "database-jdbc",
    displayTitle: "Database with JDBC",
    isLocked: true,
    title: "Database with JDBC",
    dateRange: "Jul 27 - Jul 31",
    description: "Connect Java code to databases through JDBC.",
    topics: ["Databases", "JDBC"],
    sections: [],
    assignments: []
  },
  {
    id: "final",
    displayTitle: "Module: Final Exam",
    isLocked: true,
    title: "Final Exam",
    dateRange: "Jul 30 - Jul 31",
    description: "Comprehensive final exam window covering the course topics.",
    topics: ["Review", "Comprehensive exam"],
    sections: [],
    assignments: []
  }
];

export const courseAssignments = courseModules.flatMap((module) =>
  module.assignments.map((assignment) => ({
    ...assignment,
    moduleId: module.id,
    moduleTitle: module.title
  }))
);

export const courseModuleIds = courseModules.map((module) => module.id);

export function getCourseModule(moduleId: string) {
  return courseModules.find((module) => module.id === moduleId) ?? null;
}
