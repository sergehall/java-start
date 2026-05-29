package dev.serge.javastart.infrastructure.security;

import java.util.UUID;

public record AppPrincipal(UUID userId, String email) {
}
