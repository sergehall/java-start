package dev.serge.javastart.infrastructure.mail;

public record RenderedEmail(String subject, String htmlBody, String textBody) {}
