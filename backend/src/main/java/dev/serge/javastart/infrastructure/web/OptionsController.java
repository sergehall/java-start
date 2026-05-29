package dev.serge.javastart.infrastructure.web;

import dev.serge.javastart.application.dto.LearningStateOption;
import dev.serge.javastart.domain.model.LearningState;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/options")
public class OptionsController {
  @GetMapping("/learning-states")
  List<LearningStateOption> learningStates() {
    return Arrays.stream(LearningState.values()).map(LearningStateOption::from).toList();
  }
}
