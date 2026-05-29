package dev.serge.javastart.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "\"java-user-sessions\"")
public class UserSession {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserAccount user;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant expiresAt;

  private Instant revokedAt;

  protected UserSession() {}

  private UserSession(UserAccount user, Instant expiresAt) {
    this.user = user;
    this.expiresAt = expiresAt;
  }

  public static UserSession create(UserAccount user, Instant expiresAt) {
    return new UserSession(user, expiresAt);
  }

  public UUID id() {
    return id;
  }

  public UserAccount user() {
    return user;
  }

  public Instant createdAt() {
    return createdAt;
  }

  public Instant expiresAt() {
    return expiresAt;
  }

  public boolean active(Instant now) {
    return revokedAt == null && expiresAt.isAfter(now);
  }

  public void revoke(Instant revokedAt) {
    this.revokedAt = revokedAt;
  }
}
