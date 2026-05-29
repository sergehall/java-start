package dev.serge.javastart.application;

public class ProfileNotFoundException extends RuntimeException {
  public ProfileNotFoundException() {
    super("Profile was not found.");
  }
}
