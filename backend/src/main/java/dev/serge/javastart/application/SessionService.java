package dev.serge.javastart.application;

import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.domain.model.UserSession;
import dev.serge.javastart.infrastructure.config.SecurityProperties;
import dev.serge.javastart.infrastructure.persistence.UserSessionRepository;
import dev.serge.javastart.infrastructure.security.AppPrincipal;
import java.time.Clock;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {
  private final UserSessionRepository sessions;
  private final SecurityProperties securityProperties;
  private final Clock clock;

  @Autowired
  public SessionService(UserSessionRepository sessions, SecurityProperties securityProperties) {
    this(sessions, securityProperties, Clock.systemUTC());
  }

  SessionService(
      UserSessionRepository sessions, SecurityProperties securityProperties, Clock clock) {
    this.sessions = sessions;
    this.securityProperties = securityProperties;
    this.clock = clock;
  }

  @Transactional
  public UserSession create(UserAccount user) {
    return sessions.save(
        UserSession.create(user, Instant.now(clock).plus(securityProperties.tokenTtl())));
  }

  @Transactional(readOnly = true)
  public boolean active(AppPrincipal principal) {
    Instant now = Instant.now(clock);
    return sessions
        .findById(principal.sessionId())
        .filter(session -> session.user().id().equals(principal.userId()))
        .filter(session -> session.active(now))
        .isPresent();
  }

  @Transactional
  public void revoke(AppPrincipal principal) {
    sessions
        .findById(principal.sessionId())
        .filter(session -> session.user().id().equals(principal.userId()))
        .ifPresent(session -> session.revoke(Instant.now(clock)));
  }
}
