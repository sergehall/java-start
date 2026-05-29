package dev.serge.javastart.infrastructure.mail;

public record VerifyEmailTemplateData(
    String appName,
    String username,
    String email,
    String supportEmail,
    String verifyUrl,
    long expiresInMinutes) {}
