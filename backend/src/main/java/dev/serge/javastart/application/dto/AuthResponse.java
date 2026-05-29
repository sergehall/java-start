package dev.serge.javastart.application.dto;

public record AuthResponse(String token, UserSummary user) {
}
