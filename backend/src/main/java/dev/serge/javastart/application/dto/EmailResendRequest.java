package dev.serge.javastart.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailResendRequest(@NotBlank @Email String email) {}
