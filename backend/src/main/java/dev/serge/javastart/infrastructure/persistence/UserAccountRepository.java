package dev.serge.javastart.infrastructure.persistence;

import dev.serge.javastart.domain.model.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {
  Optional<UserAccount> findByEmail(String email);

  Optional<UserAccount> findByGithubId(String githubId);

  boolean existsByEmail(String email);
}
