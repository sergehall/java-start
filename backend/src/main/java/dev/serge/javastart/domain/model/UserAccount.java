package dev.serge.javastart.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "\"java-user-accounts\"")
public class UserAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true, length = 320)
  private String email;

  @Column(name = "username", nullable = false, length = 80)
  private String username;

  @Column(nullable = false)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private UserRole role = UserRole.USER;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private boolean emailVerified;

  private Instant emailVerifiedAt;

  protected UserAccount() {}

  private UserAccount(String email, String username, String passwordHash) {
    this.email = normalizeEmail(email);
    this.username = username.trim();
    this.passwordHash = passwordHash;
  }

  public static UserAccount register(String email, String username, String passwordHash) {
    return new UserAccount(email, username, passwordHash);
  }

  public UUID id() {
    return id;
  }

  public String email() {
    return email;
  }

  public String username() {
    return username;
  }

  public String passwordHash() {
    return passwordHash;
  }

  public UserRole role() {
    return role;
  }

  public Instant createdAt() {
    return createdAt;
  }

  public boolean emailVerified() {
    return emailVerified;
  }

  public Instant emailVerifiedAt() {
    return emailVerifiedAt;
  }

  public void verifyEmail(Instant verifiedAt) {
    emailVerified = true;
    emailVerifiedAt = verifiedAt;
  }

  public static String normalizeEmail(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }
}
