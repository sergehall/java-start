package dev.serge.javastart.domain.model;

public enum LearningState {
  FOCUSED("Focused", "Deep work mode: one topic, one clear win."),
  CURIOUS("Curious", "Exploration mode: compare ideas and ask questions."),
  BUILDING("Building", "Practice mode: turn concepts into working code."),
  STUCK("Stuck", "Recovery mode: simplify the problem and find the next step."),
  RESTING("Resting", "Recharge mode: protect attention and return fresh.");

  private final String label;
  private final String description;

  LearningState(String label, String description) {
    this.label = label;
    this.description = description;
  }

  public String label() {
    return label;
  }

  public String description() {
    return description;
  }
}
