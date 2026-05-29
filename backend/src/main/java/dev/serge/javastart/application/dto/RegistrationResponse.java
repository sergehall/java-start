package dev.serge.javastart.application.dto;

public record RegistrationResponse(
    String state, String email, boolean verificationEmailQueued, String message) {}
