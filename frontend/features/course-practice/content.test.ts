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

    for (const sectionId of ["overview"]) {
      const section = javaReview?.sections.find((item) => item.id === sectionId);

      expect(section?.items).toEqual([]);
      expect(section?.description).toEqual(expect.any(String));
    }

    const setup = javaReview?.sections.find((section) => section.id === "setup");

    expect(setup?.items.map((item) => item.title)).toEqual([
      "Install Java Development Kit (JDK)",
      "Install Maven",
      "How to create a Java Project"
    ]);
    expect(setup?.items.every((item) => item.type === "Page")).toBe(true);

    const lecture = javaReview?.sections.find((section) => section.id === "lecture");

    expect(lecture?.items.map((item) => item.title)).toEqual([
      "Lecture: Java Basics",
      "Quiz - Basic Program",
      "Lecture: Arithmetic",
      "Quiz - Arithmetic",
      "Lecture: Conditions",
      "Quiz - Conditions",
      "Lecture: Logical Operators & Nested Conditions",
      "Quiz - Nested Conditions",
      "Lecture: Switch Statement",
      "Quiz - Switch",
      "Lecture: Loops",
      "Quiz - Loops",
      "Lecture: Methods",
      "Quiz - Methods",
      "Lecture: Arrays",
      "Quiz - Arrays",
      "Lecture: Classes & Objects",
      "Quiz - OOP",
      "Reading: Java Review"
    ]);
    expect(lecture?.items.filter((item) => item.type === "Quiz")).toHaveLength(9);
    expect(lecture?.items.find((item) => item.id === "quiz-loops")).toMatchObject({
      dueLabel: "Jun 28",
      points: "5 pts",
      type: "Quiz"
    });

    expect(javaReview?.sections.flatMap((section) => section.items)).toHaveLength(23);

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

  it("should expose Inheritance Canvas module sections and task metadata", () => {
    const inheritance = courseModules.find((module) => module.id === "inheritance");

    expect(inheritance?.sections.map((section) => section.title)).toEqual(["Overview", "Lecture", "Tasks"]);

    expect(inheritance?.sections.find((section) => section.id === "overview")?.items).toEqual([
      {
        id: "inheritance-overview",
        title: "Inheritance: Overview",
        type: "Page",
        href: "#inheritance-overview"
      }
    ]);

    const lecture = inheritance?.sections.find((section) => section.id === "lecture");

    expect(lecture?.items.map((item) => item.title)).toEqual([
      "Lecture: Inheritance",
      "Quiz - Inheritance",
      "Lecture: Packages",
      "Quiz - Packages",
      "Lecture: Access Levels",
      "Quiz - Access Levels",
      "Lecture: Constructors & super Keyword",
      "Quiz - Inheritance: Constructors & super",
      "Lecture: Abstract Classes",
      "Quiz - Abstract Classes",
      "Reading: Inheritance"
    ]);
    expect(lecture?.items.filter((item) => item.type === "Quiz")).toHaveLength(5);
    expect(lecture?.items.find((item) => item.id === "quiz-inheritance")).toMatchObject({
      dueLabel: "Jun 28",
      points: "3 pts",
      type: "Quiz"
    });

    const discussion = inheritance?.sections
      .find((section) => section.id === "tasks")
      ?.items.find((item) => item.id === "discussion-inheritance");

    expect(discussion).toMatchObject({
      dueLabel: "Jun 25",
      points: "5 pts",
      title: "Discussion: Inheritance",
      type: "Discussion"
    });
  });

  it("should expose Polymorphism Canvas module sections and task metadata", () => {
    const polymorphism = courseModules.find((module) => module.id === "polymorphism-dynamic-binding-interfaces");

    expect(polymorphism?.sections.map((section) => section.title)).toEqual([
      "Overview",
      "Lecture - Polymorphism & Dynamic Binding",
      "Lecture - Interfaces",
      "Tasks"
    ]);

    expect(polymorphism?.sections.find((section) => section.id === "overview")?.items).toEqual([
      {
        id: "polymorphism-overview",
        title: "Polymorphism: Overview",
        type: "Page",
        href: "#polymorphism-overview"
      }
    ]);

    const dynamicBindingLecture = polymorphism?.sections.find(
      (section) => section.id === "lecture-polymorphism-dynamic-binding"
    );

    expect(dynamicBindingLecture?.items.map((item) => item.title)).toEqual([
      "Lecture: Polymorphism",
      "Quiz: Polymorphism",
      "Lecture: Overriding Methods",
      "Quiz: Overriding Methods",
      "Lecture: Dynamic Binding",
      "Quiz: Dynamic Binding"
    ]);
    expect(dynamicBindingLecture?.items.filter((item) => item.type === "Quiz")).toHaveLength(3);

    const interfaceLecture = polymorphism?.sections.find((section) => section.id === "lecture-interfaces");

    expect(interfaceLecture?.items.map((item) => item.title)).toEqual([
      "Lecture: Intro to Interfaces",
      "Lecture: Extending an Interface",
      "Quiz: Interfaces",
      "Lecture: More on Interfaces",
      "Quiz: More on Interfaces",
      "Lecture: Anonymous Classes",
      "Quiz: Anonymous Classes",
      "Lecture: Functional Interfaces",
      "Quiz: Functional Interfaces",
      "Reading: Polymorphism & Interfaces"
    ]);
    expect(interfaceLecture?.items.filter((item) => item.type === "Quiz")).toHaveLength(4);
    expect(interfaceLecture?.items.find((item) => item.id === "quiz-interfaces")).toMatchObject({
      dueLabel: "Jun 28",
      points: "4 pts",
      type: "Quiz"
    });

    const assignment = polymorphism?.sections
      .find((section) => section.id === "tasks")
      ?.items.find((item) => item.id === "assignment-polymorphism");

    expect(assignment).toMatchObject({
      dueLabel: "Jun 28",
      points: "1 pts",
      title: "Assignment: Polymorphism",
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
