package dev.serge.javastart.application.dto;

import dev.serge.javastart.domain.model.UserAccount;
import java.time.Instant;
import java.util.UUID;

public record UserSummary(
    UUID id, String email, String username, String role, Instant createdAt, boolean emailVerified) {
  public static UserSummary from(UserAccount user) {
    return new UserSummary(
        user.id(),
        user.email(),
        user.username(),
        user.role().name(),
        user.createdAt(),
        user.emailVerified());
  }
}
