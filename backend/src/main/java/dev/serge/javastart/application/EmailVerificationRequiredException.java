package dev.serge.javastart.application;

public class EmailVerificationRequiredException extends RuntimeException {
  private final String email;

  public EmailVerificationRequiredException(String email) {
    super("Verify your email before signing in.");
    this.email = email;
  }

  public String email() {
    return email;
  }
}
