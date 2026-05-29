package dev.serge.javastart.infrastructure.web;

import dev.serge.javastart.application.EmailAlreadyUsedException;
import dev.serge.javastart.application.EmailVerificationRequiredException;
import dev.serge.javastart.application.EmailVerificationTokenExpiredException;
import dev.serge.javastart.application.EmailVerificationTokenInvalidException;
import dev.serge.javastart.application.InvalidCredentialsException;
import dev.serge.javastart.application.ProfileNotFoundException;
import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(EmailAlreadyUsedException.class)
  ProblemDetail conflict(EmailAlreadyUsedException exception) {
    return problem(HttpStatus.CONFLICT, "Email already registered", exception.getMessage());
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  ProblemDetail unauthorized(InvalidCredentialsException exception) {
    return problem(HttpStatus.UNAUTHORIZED, "Invalid credentials", exception.getMessage());
  }

  @ExceptionHandler(EmailVerificationRequiredException.class)
  ProblemDetail emailVerificationRequired(EmailVerificationRequiredException exception) {
    ProblemDetail detail =
        problem(HttpStatus.FORBIDDEN, "Email verification required", exception.getMessage());
    detail.setProperty("reason", "email_not_verified");
    detail.setProperty("email", exception.email());
    return detail;
  }

  @ExceptionHandler(EmailVerificationTokenExpiredException.class)
  ProblemDetail emailVerificationExpired(EmailVerificationTokenExpiredException exception) {
    return problem(HttpStatus.GONE, "Email verification expired", exception.getMessage());
  }

  @ExceptionHandler(EmailVerificationTokenInvalidException.class)
  ProblemDetail emailVerificationInvalid(EmailVerificationTokenInvalidException exception) {
    return problem(HttpStatus.BAD_REQUEST, "Email verification invalid", exception.getMessage());
  }

  @ExceptionHandler(ProfileNotFoundException.class)
  ProblemDetail notFound(ProfileNotFoundException exception) {
    return problem(HttpStatus.NOT_FOUND, "Profile not found", exception.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ProblemDetail validation(MethodArgumentNotValidException exception) {
    ProblemDetail detail =
        problem(
            HttpStatus.BAD_REQUEST, "Validation failed", "Request body contains invalid fields.");
    detail.setProperty(
        "errors",
        exception.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .toList());
    return detail;
  }

  @ExceptionHandler(IllegalArgumentException.class)
  ProblemDetail badRequest(IllegalArgumentException exception) {
    return problem(HttpStatus.BAD_REQUEST, "Bad request", exception.getMessage());
  }

  private ProblemDetail problem(HttpStatus status, String title, String detailText) {
    ProblemDetail detail = ProblemDetail.forStatusAndDetail(status, detailText);
    detail.setTitle(title);
    detail.setType(URI.create("https://java-start.dev/problems/" + status.value()));
    return detail;
  }
}
