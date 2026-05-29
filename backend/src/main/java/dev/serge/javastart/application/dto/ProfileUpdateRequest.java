package dev.serge.javastart.application.dto;

import dev.serge.javastart.domain.model.LearningState;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
    @NotNull LearningState learningState,
    @Min(0) @Max(100) int energyLevel,
    @NotBlank @Size(max = 160) String learningGoal,
    @NotBlank @Size(max = 240) String nextStep) {}
