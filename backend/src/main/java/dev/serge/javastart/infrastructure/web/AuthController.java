package dev.serge.javastart.infrastructure.web;

import dev.serge.javastart.application.AuthService;
import dev.serge.javastart.application.dto.AuthResponse;
import dev.serge.javastart.application.dto.EmailResendRequest;
import dev.serge.javastart.application.dto.EmailVerificationRequest;
import dev.serge.javastart.application.dto.LoginRequest;
import dev.serge.javastart.application.dto.RegisterRequest;
import dev.serge.javastart.application.dto.RegistrationResponse;
import dev.serge.javastart.application.dto.UserSummary;
import dev.serge.javastart.infrastructure.security.AppPrincipal;
import jakarta.validation.Valid;
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

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  RegistrationResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
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
}
