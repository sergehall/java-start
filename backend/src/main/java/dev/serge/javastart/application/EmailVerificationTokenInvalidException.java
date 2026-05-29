package dev.serge.javastart.application;

public class EmailVerificationTokenInvalidException extends RuntimeException {
  public EmailVerificationTokenInvalidException() {
    super("Email verification link is invalid or has already been used.");
  }
}
