package dev.serge.javastart.infrastructure.persistence;

import dev.serge.javastart.domain.model.UserSession;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {}
