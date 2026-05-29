package dev.serge.javastart.application;

public class EmailAlreadyUsedException extends RuntimeException {
  public EmailAlreadyUsedException() {
    super("Email is already registered.");
  }
}
