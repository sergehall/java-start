package dev.serge.javastart.application.dto;

import dev.serge.javastart.domain.model.LearningState;

public record LearningStateOption(String value, String label, String description) {
    public static LearningStateOption from(LearningState state) {
        return new LearningStateOption(state.name(), state.label(), state.description());
    }
}
