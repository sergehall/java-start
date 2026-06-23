import java.time.LocalDate;
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
