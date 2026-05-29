package dev.serge.javastart.application;

import dev.serge.javastart.application.dto.ProfileResponse;
import dev.serge.javastart.application.dto.ProfileUpdateRequest;
import dev.serge.javastart.infrastructure.persistence.UserProfileRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    private final UserProfileRepository profiles;

    public ProfileService(UserProfileRepository profiles) {
        this.profiles = profiles;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        return profiles.findByUserId(userId)
                .map(ProfileResponse::from)
                .orElseThrow(ProfileNotFoundException::new);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        var profile = profiles.findByUserId(userId).orElseThrow(ProfileNotFoundException::new);
        profile.update(request.learningState(), request.energyLevel(), request.learningGoal(), request.nextStep());
        return ProfileResponse.from(profile);
    }
}
