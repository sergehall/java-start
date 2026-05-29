package dev.serge.javastart.application.dto;

import dev.serge.javastart.domain.model.UserAccount;
import java.time.Instant;
import java.util.UUID;

public record UserSummary(UUID id, String email, String displayName, String role, Instant createdAt) {
    public static UserSummary from(UserAccount user) {
        return new UserSummary(user.id(), user.email(), user.displayName(), user.role().name(), user.createdAt());
    }
}
