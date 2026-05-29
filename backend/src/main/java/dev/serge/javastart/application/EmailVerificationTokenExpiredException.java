package dev.serge.javastart.application;

public class EmailVerificationTokenExpiredException extends RuntimeException {
  public EmailVerificationTokenExpiredException() {
    super("Email verification link has expired. Request a fresh verification email.");
  }
}
