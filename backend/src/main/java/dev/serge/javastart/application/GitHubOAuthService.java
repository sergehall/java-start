package dev.serge.javastart.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.serge.javastart.application.dto.AuthResponse;
import dev.serge.javastart.application.dto.GitHubOAuthCompleteRequest;
import dev.serge.javastart.application.dto.UserSummary;
import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.domain.model.UserProfile;
import dev.serge.javastart.infrastructure.config.OAuthProperties;
import dev.serge.javastart.infrastructure.config.SecurityProperties;
import dev.serge.javastart.infrastructure.persistence.UserAccountRepository;
import dev.serge.javastart.infrastructure.persistence.UserProfileRepository;
import dev.serge.javastart.infrastructure.security.JwtService;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GitHubOAuthService {
  private static final URI GITHUB_AUTHORIZE_URI =
      URI.create("https://github.com/login/oauth/authorize");
  private static final URI GITHUB_TOKEN_URI =
      URI.create("https://github.com/login/oauth/access_token");
  private static final URI GITHUB_USER_URI = URI.create("https://api.github.com/user");
  private static final URI GITHUB_EMAILS_URI = URI.create("https://api.github.com/user/emails");
  private static final String HMAC_ALGORITHM = "HmacSHA256";
  private static final long STATE_TTL_SECONDS = 300;

  private final OAuthProperties properties;
  private final SecurityProperties securityProperties;
  private final UserAccountRepository users;
  private final UserProfileRepository profiles;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final SessionService sessionService;
  private final RestClient restClient;
  private final Clock clock;

  @Autowired
  public GitHubOAuthService(
      OAuthProperties properties,
      SecurityProperties securityProperties,
      UserAccountRepository users,
      UserProfileRepository profiles,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      SessionService sessionService) {
    this(
        properties,
        securityProperties,
        users,
        profiles,
        passwordEncoder,
        jwtService,
        sessionService,
        RestClient.create(),
        Clock.systemUTC());
  }

  GitHubOAuthService(
      OAuthProperties properties,
      SecurityProperties securityProperties,
      UserAccountRepository users,
      UserProfileRepository profiles,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      SessionService sessionService,
      RestClient restClient,
      Clock clock) {
    this.properties = properties;
    this.securityProperties = securityProperties;
    this.users = users;
    this.profiles = profiles;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.sessionService = sessionService;
    this.restClient = restClient;
    this.clock = clock;
  }

  public URI authorizationUri() {
    OAuthProperties.GitHub github = configuredGithub();
    return UriComponentsBuilder.fromUri(GITHUB_AUTHORIZE_URI)
        .queryParam("client_id", github.clientId())
        .queryParam("redirect_uri", github.redirectUri())
        .queryParam("scope", "read:user user:email")
        .queryParam("state", createState())
        .build()
        .toUri();
  }

  @Transactional
  public AuthResponse complete(GitHubOAuthCompleteRequest request) {
    OAuthProperties.GitHub github = configuredGithub();
    validateState(request.state());

    GitHubTokenResponse token = exchangeCode(github, request.code());
    GitHubUserResponse githubUser = fetchGitHubUser(token.accessToken());
    List<GitHubEmailResponse> emails = fetchGitHubEmails(token.accessToken());
    String email = primaryVerifiedEmail(githubUser, emails);
    String githubId = String.valueOf(githubUser.id());

    UserAccount user =
        users
            .findByGithubId(githubId)
            .or(() -> users.findByEmail(UserAccount.normalizeEmail(email)))
            .map(existing -> linkExistingUser(existing, githubId))
            .orElseGet(() -> createGithubUser(email, githubUser, githubId));

    profiles.findByUserId(user.id()).orElseGet(() -> profiles.save(UserProfile.forUser(user)));
    return issueToken(user);
  }

  private OAuthProperties.GitHub configuredGithub() {
    OAuthProperties.GitHub github = properties.github();
    if (github == null
        || isBlank(github.clientId())
        || isBlank(github.clientSecret())
        || isBlank(github.redirectUri())) {
      throw new OAuthConfigurationException();
    }
    return github;
  }

  private GitHubTokenResponse exchangeCode(OAuthProperties.GitHub github, String code) {
    try {
      MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
      form.add("client_id", github.clientId());
      form.add("client_secret", github.clientSecret());
      form.add("code", code);
      form.add("redirect_uri", github.redirectUri());

      GitHubTokenResponse response =
          restClient
              .post()
              .uri(GITHUB_TOKEN_URI)
              .contentType(MediaType.APPLICATION_FORM_URLENCODED)
              .accept(MediaType.APPLICATION_JSON)
              .body(form)
              .retrieve()
              .body(GitHubTokenResponse.class);
      if (response == null || isBlank(response.accessToken())) {
        throw new OAuthProviderException("GitHub did not return an access token.");
      }
      return response;
    } catch (RestClientException exception) {
      throw new OAuthProviderException("GitHub token exchange failed.");
    }
  }

  private GitHubUserResponse fetchGitHubUser(String accessToken) {
    try {
      GitHubUserResponse response =
          restClient
              .get()
              .uri(GITHUB_USER_URI)
              .headers(headers -> bearerHeaders(headers, accessToken))
              .retrieve()
              .body(GitHubUserResponse.class);
      if (response == null || response.id() == null || isBlank(response.login())) {
        throw new OAuthProviderException("GitHub user profile is incomplete.");
      }
      return response;
    } catch (RestClientException exception) {
      throw new OAuthProviderException("GitHub user profile request failed.");
    }
  }

  private List<GitHubEmailResponse> fetchGitHubEmails(String accessToken) {
    try {
      GitHubEmailResponse[] response =
          restClient
              .get()
              .uri(GITHUB_EMAILS_URI)
              .headers(headers -> bearerHeaders(headers, accessToken))
              .retrieve()
              .body(GitHubEmailResponse[].class);
      return response == null ? List.of() : List.of(response);
    } catch (RestClientException exception) {
      throw new OAuthProviderException("GitHub email request failed.");
    }
  }

  private void bearerHeaders(HttpHeaders headers, String accessToken) {
    headers.setBearerAuth(accessToken);
    headers.setAccept(List.of(MediaType.APPLICATION_JSON));
  }

  private String primaryVerifiedEmail(
      GitHubUserResponse githubUser, List<GitHubEmailResponse> emails) {
    return emails.stream()
        .filter(email -> email.primary() && email.verified() && !isBlank(email.email()))
        .map(GitHubEmailResponse::email)
        .findFirst()
        .or(
            () ->
                emails.stream()
                    .filter(email -> email.verified())
                    .map(GitHubEmailResponse::email)
                    .findFirst())
        .or(
            () ->
                isBlank(githubUser.email())
                    ? java.util.Optional.empty()
                    : java.util.Optional.of(githubUser.email()))
        .map(UserAccount::normalizeEmail)
        .orElseThrow(
            () -> new OAuthProviderException("GitHub account does not expose a verified email."));
  }

  private UserAccount linkExistingUser(UserAccount user, String githubId) {
    if (isBlank(user.githubId())) {
      user.linkGithub(githubId);
    }
    if (!user.emailVerified()) {
      user.verifyEmail(Instant.now(clock));
    }
    return user;
  }

  private UserAccount createGithubUser(
      String email, GitHubUserResponse githubUser, String githubId) {
    String username = isBlank(githubUser.name()) ? githubUser.login() : githubUser.name();
    String passwordHash = passwordEncoder.encode(UUID.randomUUID().toString());
    UserAccount user =
        users.save(
            UserAccount.registerGithub(
                email, username, passwordHash, githubId, Instant.now(clock)));
    profiles.save(UserProfile.forUser(user));
    return user;
  }

  private AuthResponse issueToken(UserAccount user) {
    return new AuthResponse(
        jwtService.createToken(user, sessionService.create(user).id()), UserSummary.from(user));
  }

  private String createState() {
    String payload =
        "%d:%s"
            .formatted(
                Instant.now(clock).plusSeconds(STATE_TTL_SECONDS).getEpochSecond(),
                UUID.randomUUID());
    String encodedPayload = base64Url(payload.getBytes(StandardCharsets.UTF_8));
    return encodedPayload + "." + sign(encodedPayload);
  }

  private void validateState(String state) {
    String[] parts = state.split("\\.", -1);
    if (parts.length != 2 || !sign(parts[0]).equals(parts[1])) {
      throw new InvalidOAuthStateException();
    }

    long expiresAt;
    try {
      String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
      String[] payloadParts = payload.split(":", 2);
      if (payloadParts.length != 2) {
        throw new InvalidOAuthStateException();
      }
      expiresAt = Long.parseLong(payloadParts[0]);
    } catch (IllegalArgumentException exception) {
      throw new InvalidOAuthStateException();
    }

    if (expiresAt < Instant.now(clock).getEpochSecond()) {
      throw new InvalidOAuthStateException();
    }
  }

  private String sign(String value) {
    try {
      Mac mac = Mac.getInstance(HMAC_ALGORITHM);
      mac.init(
          new SecretKeySpec(
              securityProperties.jwtSecret().getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
      return base64Url(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    } catch (GeneralSecurityException exception) {
      throw new IllegalStateException("OAuth state signing failed.", exception);
    }
  }

  private String base64Url(byte[] value) {
    return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }

  record GitHubTokenResponse(@JsonProperty("access_token") String accessToken) {}

  record GitHubUserResponse(Long id, String login, String name, String email) {}

  record GitHubEmailResponse(String email, boolean primary, boolean verified) {}
}
