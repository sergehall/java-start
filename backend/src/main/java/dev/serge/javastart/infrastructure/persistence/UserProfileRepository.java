package dev.serge.javastart.infrastructure.persistence;

import dev.serge.javastart.domain.model.UserProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    @EntityGraph(attributePaths = "user")
    Optional<UserProfile> findByUserId(UUID userId);
}
