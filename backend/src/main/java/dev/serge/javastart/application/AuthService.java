package dev.serge.javastart.application;

import dev.serge.javastart.application.dto.AuthResponse;
import dev.serge.javastart.application.dto.EmailResendRequest;
import dev.serge.javastart.application.dto.EmailVerificationRequest;
import dev.serge.javastart.application.dto.LoginRequest;
import dev.serge.javastart.application.dto.RegisterRequest;
import dev.serge.javastart.application.dto.RegistrationResponse;
import dev.serge.javastart.application.dto.UserSummary;
import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.domain.model.UserProfile;
import dev.serge.javastart.domain.model.UserSession;
import dev.serge.javastart.infrastructure.persistence.UserAccountRepository;
import dev.serge.javastart.infrastructure.persistence.UserProfileRepository;
import dev.serge.javastart.infrastructure.security.AppPrincipal;
import dev.serge.javastart.infrastructure.security.JwtService;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserAccountRepository users;
  private final UserProfileRepository profiles;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final EmailVerificationService emailVerificationService;
  private final SessionService sessionService;

  public AuthService(
      UserAccountRepository users,
      UserProfileRepository profiles,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      EmailVerificationService emailVerificationService,
      SessionService sessionService) {
    this.users = users;
    this.profiles = profiles;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.emailVerificationService = emailVerificationService;
    this.sessionService = sessionService;
  }

  @Transactional
  public RegistrationResponse register(RegisterRequest request) {
    String email = UserAccount.normalizeEmail(request.email());
    if (users.existsByEmail(email)) {
      throw new EmailAlreadyUsedException();
    }
    UserAccount user =
        users.save(
            UserAccount.register(
                email, request.username(), passwordEncoder.encode(request.password())));
    profiles.save(UserProfile.forUser(user));
    boolean queued = emailVerificationService.sendVerificationEmail(user);
    return new RegistrationResponse(
        "email_verification_required",
        user.email(),
        queued,
        "Registration accepted. Check your email to verify the account.");
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    UserAccount user =
        users
            .findByEmail(UserAccount.normalizeEmail(request.email()))
            .filter(found -> passwordEncoder.matches(request.password(), found.passwordHash()))
            .orElseThrow(InvalidCredentialsException::new);
    if (!user.emailVerified()) {
      throw new EmailVerificationRequiredException(user.email());
    }
    return issueToken(user);
  }

  @Transactional
  public AuthResponse verifyEmail(EmailVerificationRequest request) {
    UserAccount user = emailVerificationService.verify(request.token());
    return issueToken(user);
  }

  @Transactional
  public RegistrationResponse resendVerification(EmailResendRequest request) {
    String email = UserAccount.normalizeEmail(request.email());
    users
        .findByEmail(email)
        .filter(user -> !user.emailVerified())
        .ifPresent(emailVerificationService::sendVerificationEmail);
    return new RegistrationResponse(
        "email_verification_required",
        email,
        true,
        "If the account exists and still needs verification, a fresh email has been queued.");
  }

  @Transactional(readOnly = true)
  public UserSummary me(UUID userId) {
    return users
        .findById(userId)
        .map(UserSummary::from)
        .orElseThrow(InvalidCredentialsException::new);
  }

  @Transactional
  public void logout(AppPrincipal principal) {
    sessionService.revoke(principal);
  }

  private AuthResponse issueToken(UserAccount user) {
    UserSession session = sessionService.create(user);
    return new AuthResponse(jwtService.createToken(user, session.id()), UserSummary.from(user));
  }
}
