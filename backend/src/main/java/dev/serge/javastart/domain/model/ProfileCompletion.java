package dev.serge.javastart.domain.model;

public final class ProfileCompletion {
  private ProfileCompletion() {}

  public static int calculate(UserAccount user, UserProfile profile) {
    int score = 20;
    if (!user.username().isBlank()) {
      score += 20;
    }
    if (!profile.learningGoal().isBlank()) {
      score += 25;
    }
    if (!profile.nextStep().isBlank()) {
      score += 20;
    }
    if (profile.energyLevel() > 0) {
      score += 15;
    }
    return Math.min(score, 100);
  }
}
