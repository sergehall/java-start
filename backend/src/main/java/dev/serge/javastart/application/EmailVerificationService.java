package dev.serge.javastart.application;

import dev.serge.javastart.domain.model.EmailVerificationToken;
import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.infrastructure.mail.AppMailProperties;
import dev.serge.javastart.infrastructure.mail.EmailMessage;
import dev.serge.javastart.infrastructure.mail.EmailTemplateRenderer;
import dev.serge.javastart.infrastructure.mail.EmailTokenGenerator;
import dev.serge.javastart.infrastructure.mail.MailProvider;
import dev.serge.javastart.infrastructure.mail.VerifyEmailTemplateData;
import dev.serge.javastart.infrastructure.persistence.EmailVerificationTokenRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {
  private final EmailVerificationTokenRepository tokens;
  private final EmailTokenGenerator tokenGenerator;
  private final EmailTemplateRenderer renderer;
  private final MailProvider mailProvider;
  private final AppMailProperties properties;
  private final Clock clock;

  @Autowired
  public EmailVerificationService(
      EmailVerificationTokenRepository tokens,
      EmailTokenGenerator tokenGenerator,
      EmailTemplateRenderer renderer,
      MailProvider mailProvider,
      AppMailProperties properties) {
    this(tokens, tokenGenerator, renderer, mailProvider, properties, Clock.systemUTC());
  }

  EmailVerificationService(
      EmailVerificationTokenRepository tokens,
      EmailTokenGenerator tokenGenerator,
      EmailTemplateRenderer renderer,
      MailProvider mailProvider,
      AppMailProperties properties,
      Clock clock) {
    this.tokens = tokens;
    this.tokenGenerator = tokenGenerator;
    this.renderer = renderer;
    this.mailProvider = mailProvider;
    this.properties = properties;
    this.clock = clock;
  }

  public boolean sendVerificationEmail(UserAccount user) {
    String rawToken = tokenGenerator.generateToken();
    Duration ttl = verificationTtl();
    EmailVerificationToken token =
        EmailVerificationToken.issue(user, hash(rawToken), Instant.now(clock).plus(ttl));
    tokens.save(token);

    var rendered =
        renderer.renderVerifyEmail(
            new VerifyEmailTemplateData(
                "Java Start",
                user.username(),
                user.email(),
                properties.support(),
                verificationUrl(rawToken),
                ttl.toMinutes()));
    mailProvider.send(
        new EmailMessage(
            user.email(), rendered.subject(), rendered.htmlBody(), rendered.textBody()));
    return true;
  }

  public UserAccount verify(String rawToken) {
    Instant now = Instant.now(clock);
    EmailVerificationToken token =
        tokens
            .findByTokenHash(hash(rawToken))
            .orElseThrow(EmailVerificationTokenInvalidException::new);
    if (token.consumed()) {
      throw new EmailVerificationTokenInvalidException();
    }
    if (token.expired(now)) {
      throw new EmailVerificationTokenExpiredException();
    }

    UserAccount user = token.user();
    user.verifyEmail(now);
    token.consume(now);
    return user;
  }

  private Duration verificationTtl() {
    long seconds =
        properties.verificationTtlSeconds() <= 0 ? 900 : properties.verificationTtlSeconds();
    return Duration.ofSeconds(seconds);
  }

  private String verificationUrl(String rawToken) {
    String baseUrl = properties.frontendUrl();
    String separator = baseUrl.endsWith("/") ? "" : "/";
    return baseUrl
        + separator
        + "verify-email?token="
        + URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
  }

  private String hash(String rawToken) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(rawToken.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException exception) {
      throw new IllegalStateException("SHA-256 is not available.", exception);
    }
  }
}
