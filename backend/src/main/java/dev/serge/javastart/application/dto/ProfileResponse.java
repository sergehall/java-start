package dev.serge.javastart.application.dto;

import dev.serge.javastart.domain.model.ProfileCompletion;
import dev.serge.javastart.domain.model.UserProfile;
import java.time.Instant;
import java.util.UUID;

public record ProfileResponse(
    UUID id,
    String learningState,
    int energyLevel,
    String learningGoal,
    String nextStep,
    int completion,
    Instant updatedAt) {
  public static ProfileResponse from(UserProfile profile) {
    return new ProfileResponse(
        profile.id(),
        profile.learningState().name(),
        profile.energyLevel(),
        profile.learningGoal(),
        profile.nextStep(),
        ProfileCompletion.calculate(profile.user(), profile),
        profile.updatedAt());
  }
}
