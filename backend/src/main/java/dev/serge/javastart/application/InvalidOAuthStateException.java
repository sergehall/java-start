package dev.serge.javastart.application;

public class InvalidOAuthStateException extends RuntimeException {
  public InvalidOAuthStateException() {
    super("GitHub OAuth state is invalid or expired.");
  }
}
