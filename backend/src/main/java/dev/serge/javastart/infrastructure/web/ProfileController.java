package dev.serge.javastart.infrastructure.web;

import dev.serge.javastart.application.ProfileService;
import dev.serge.javastart.application.dto.ProfileResponse;
import dev.serge.javastart.application.dto.ProfileUpdateRequest;
import dev.serge.javastart.infrastructure.security.AppPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
  private final ProfileService profileService;

  public ProfileController(ProfileService profileService) {
    this.profileService = profileService;
  }

  @GetMapping
  ProfileResponse getProfile(@AuthenticationPrincipal AppPrincipal principal) {
    return profileService.getProfile(principal.userId());
  }

  @PutMapping
  ProfileResponse updateProfile(
      @AuthenticationPrincipal AppPrincipal principal,
      @Valid @RequestBody ProfileUpdateRequest request) {
    return profileService.updateProfile(principal.userId(), request);
  }
}
