package dev.serge.javastart.infrastructure.web;

import dev.serge.javastart.application.AuthService;
import dev.serge.javastart.application.GitHubOAuthService;
import dev.serge.javastart.application.dto.AuthResponse;
import dev.serge.javastart.application.dto.EmailResendRequest;
import dev.serge.javastart.application.dto.EmailVerificationRequest;
import dev.serge.javastart.application.dto.GitHubOAuthCompleteRequest;
import dev.serge.javastart.application.dto.RegistrationResponse;
import dev.serge.javastart.application.dto.SignInRequest;
import dev.serge.javastart.application.dto.SignUpRequest;
import dev.serge.javastart.application.dto.UserSummary;
import dev.serge.javastart.infrastructure.security.AppPrincipal;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AuthService authService;
  private final GitHubOAuthService gitHubOAuthService;

  public AuthController(AuthService authService, GitHubOAuthService gitHubOAuthService) {
    this.authService = authService;
    this.gitHubOAuthService = gitHubOAuthService;
  }

  @PostMapping("/sign-up")
  RegistrationResponse signUp(@Valid @RequestBody SignUpRequest request) {
    return authService.signUp(request);
  }

  @PostMapping("/sign-in")
  AuthResponse signIn(@Valid @RequestBody SignInRequest request) {
    return authService.signIn(request);
  }

  @PostMapping("/logout")
  void logout(@AuthenticationPrincipal AppPrincipal principal) {
    authService.logout(principal);
  }

  @PostMapping("/email/verify")
  AuthResponse verifyEmail(@Valid @RequestBody EmailVerificationRequest request) {
    return authService.verifyEmail(request);
  }

  @PostMapping("/email/resend")
  RegistrationResponse resendVerification(@Valid @RequestBody EmailResendRequest request) {
    return authService.resendVerification(request);
  }

  @GetMapping("/me")
  UserSummary me(@AuthenticationPrincipal AppPrincipal principal) {
    return authService.me(principal.userId());
  }

  @GetMapping("/oauth/github/start")
  ResponseEntity<Void> startGitHubOAuth() {
    URI redirect = gitHubOAuthService.authorizationUri();
    return ResponseEntity.status(302).location(redirect).build();
  }

  @PostMapping("/oauth/github/complete")
  AuthResponse completeGitHubOAuth(@Valid @RequestBody GitHubOAuthCompleteRequest request) {
    return gitHubOAuthService.complete(request);
  }
}
