package dev.serge.javastart.infrastructure.mail;

public record EmailMessage(String to, String subject, String htmlBody, String textBody) {}
