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
@Table(name = "\"java-email-verification-tokens\"")
public class EmailVerificationToken {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private UserAccount user;

  @Column(nullable = false, unique = true, length = 64)
  private String tokenHash;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  private Instant consumedAt;

  protected EmailVerificationToken() {}

  private EmailVerificationToken(UserAccount user, String tokenHash, Instant expiresAt) {
    this.user = user;
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
  }

  public static EmailVerificationToken issue(
      UserAccount user, String tokenHash, Instant expiresAt) {
    return new EmailVerificationToken(user, tokenHash, expiresAt);
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

  public boolean consumed() {
    return consumedAt != null;
  }

  public boolean expired(Instant now) {
    return !expiresAt.isAfter(now);
  }

  public void consume(Instant consumedAt) {
    this.consumedAt = consumedAt;
  }
}
