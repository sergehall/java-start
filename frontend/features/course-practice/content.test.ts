import { describe, expect, it } from "vitest";
import { courseAssignments, courseModules, getJavaReviewAssignmentFile } from "@/features/course-practice/content";

describe("course module content", () => {
  it("should keep the Canvas module names in display order", () => {
    expect(courseModules.map((module) => module.displayTitle)).toEqual([
      "Getting Started",
      "Module: Java Review",
      "Module: Inheritance",
      "Module: Polymorphism, Dynamic Binding & Interfaces",
      "Module: Unified Modeling Language",
      "Module: Exceptions",
      "Module: Generics",
      "Module: Design Patterns",
      "Module: Midterm",
      "Module: Collections (Data Structures)",
      "Module: Networking",
      "Module: JavaFX",
      "Module: Event Driven Programming with Java FX",
      "Module: Multithreading",
      "Database with JDBC",
      "Module: Final Exam"
    ]);
  });

  it("should expose unique module ids", () => {
    const moduleIds = courseModules.map((module) => module.id);

    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });

  it("should only unlock the currently available practice modules", () => {
    const unlockedModuleIds = courseModules.filter((module) => !module.isLocked).map((module) => module.id);

    expect(unlockedModuleIds).toEqual([
      "getting-started",
      "java-review",
      "inheritance",
      "polymorphism-dynamic-binding-interfaces"
    ]);
  });

  it("should connect every assignment to an existing module", () => {
    const moduleIds = new Set(courseModules.map((module) => module.id));

    expect(courseAssignments.length).toBeGreaterThan(0);

    for (const assignment of courseAssignments) {
      expect(moduleIds.has(assignment.moduleId)).toBe(true);
      expect(assignment.requiredFiles.length).toBeGreaterThan(0);
      expect(assignment.requirements.length).toBeGreaterThan(0);
    }
  });

  it("should expose Java Review Canvas module sections and task metadata", () => {
    const javaReview = courseModules.find((module) => module.id === "java-review");

    expect(javaReview?.sections.map((section) => section.title)).toEqual(["Overview", "Setup", "Lecture", "Tasks"]);

    for (const sectionId of ["overview", "setup", "lecture"]) {
      const section = javaReview?.sections.find((item) => item.id === sectionId);

      expect(section?.items).toEqual([]);
      expect(section?.description).toEqual(expect.any(String));
    }

    expect(javaReview?.sections.flatMap((section) => section.items)).toHaveLength(1);

    const task = javaReview?.sections
      .find((section) => section.id === "tasks")
      ?.items.find((item) => item.id === "assignment-java-review");

    expect(task).toMatchObject({
      dueLabel: "Jun 28",
      points: "20 pts",
      title: "Assignment: Java Review",
      type: "Assignment"
    });
  });

  it("should provide Java Review starter files for the modal viewer", () => {
    const assignment = courseAssignments.find((item) => item.id === "expense-tracker");

    expect(assignment?.starterFiles.map((file) => file.fileName)).toEqual([
      "Expense.java",
      "ExpenseManager.java",
      "ExpenseTrackerApp.java"
    ]);

    expect(assignment?.starterFiles.find((file) => file.fileName === "Expense.java")?.content).not.toContain("TODO");
    expect(assignment?.starterFiles.find((file) => file.fileName === "ExpenseManager.java")?.content).not.toContain(
      "TODO"
    );
    expect(assignment?.starterFiles.find((file) => file.fileName === "ExpenseTrackerApp.java")?.content).not.toContain(
      "TODO"
    );
  });

  it("should keep starter files aligned with the Java Review rubric surface", () => {
    const assignment = courseAssignments.find((item) => item.id === "expense-tracker");
    const files = new Map(assignment?.starterFiles.map((file) => [file.fileName, file.content]));

    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public class Expense"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("private String description;"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("private double amount;"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("private LocalDate date;"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("private String category;"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("import java.util.Locale;"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("LocalDate.now()"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public Expense("));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public String getDescription()"));
    expect(files.get("Expense.java")).toEqual(
      expect.stringContaining("public void setDescription(String description)")
    );
    expect(files.get("Expense.java")).toEqual(
      expect.stringContaining('throw new IllegalArgumentException("Description cannot be blank.")')
    );
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public double getAmount()"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public void setAmount(double amount)"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("Double.isNaN(amount)"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("Double.isInfinite(amount)"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public LocalDate getDate()"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public void setDate(LocalDate date)"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public String getCategory()"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public void setCategory(String category)"));
    expect(files.get("Expense.java")).toEqual(expect.stringContaining("public String toString()"));

    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("private ArrayList<Expense> expenses;"));
    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("import java.util.Locale;"));
    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("expenses = new ArrayList<>();"));
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining("public void addExpense(Expense expense)")
    );
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining('throw new IllegalArgumentException("Expense cannot be null.")')
    );
    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("public void displayExpenses()"));
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining('System.out.println("No expenses recorded.")')
    );
    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("public double calculateTotalExpenses()"));
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining("public double calculateTotalExpensesByDateRange(LocalDate startDate, LocalDate endDate)")
    );
    expect(files.get("ExpenseManager.java")).toEqual(expect.stringContaining("public void displayTotalExpenses()"));
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining("public void displayExpensesByDateRange(LocalDate startDate, LocalDate endDate)")
    );
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining("private boolean isInDateRange(Expense expense, LocalDate startDate, LocalDate endDate)")
    );
    expect(files.get("ExpenseManager.java")).toEqual(
      expect.stringContaining("private void validateDateRange(LocalDate startDate, LocalDate endDate)")
    );

    expect(files.get("ExpenseTrackerApp.java")).toEqual(
      expect.stringContaining("public static void main(String[] args)")
    );
    expect(files.get("ExpenseTrackerApp.java")).toEqual(
      expect.stringContaining("private static final int MIN_MENU_CHOICE")
    );
    expect(files.get("ExpenseTrackerApp.java")).toEqual(
      expect.stringContaining("try (Scanner scanner = new Scanner(System.in))")
    );
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("private static void addExpense"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("1. Add Expense"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("2. View All Expenses"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("3. View Total Expenses"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("4. View Expenses by Date Range"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("private static int readMenuChoice"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(
      expect.stringContaining("private static void displayExpensesForDateRange")
    );
    expect(files.get("ExpenseTrackerApp.java")).toEqual(
      expect.stringContaining("private static String readRequiredText")
    );
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("scanner.nextLine().trim()"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("Double.isNaN(amount)"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("Double.isInfinite(amount)"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("amount < 0"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("startDate.isAfter(endDate)"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("NumberFormatException"));
    expect(files.get("ExpenseTrackerApp.java")).toEqual(expect.stringContaining("DateTimeParseException"));
  });

  it("should resolve Java Review files for the download route", () => {
    expect(getJavaReviewAssignmentFile("Expense.java")?.content).toContain("public class Expense");
    expect(getJavaReviewAssignmentFile("ExpenseManager.java")?.content).toContain("public class ExpenseManager");
    expect(getJavaReviewAssignmentFile("ExpenseTrackerApp.java")?.content).toContain("public class ExpenseTrackerApp");
    expect(getJavaReviewAssignmentFile("Unknown.java")).toBeNull();
  });
});
