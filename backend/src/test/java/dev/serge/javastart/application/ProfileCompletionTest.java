package dev.serge.javastart.application;

import static org.assertj.core.api.Assertions.assertThat;

import dev.serge.javastart.domain.model.ProfileCompletion;
import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.domain.model.UserProfile;
import org.junit.jupiter.api.Test;

class ProfileCompletionTest {
    @Test
    void calculatesCompleteProfileScore() {
        UserAccount user = UserAccount.register("serge@example.com", "Serge", "hash");
        UserProfile profile = UserProfile.forUser(user);

        assertThat(ProfileCompletion.calculate(user, profile)).isEqualTo(100);
    }

    @Test
    void capsScoreAtOneHundred() {
        UserAccount user = UserAccount.register("serge@example.com", "Serge", "hash");
        UserProfile profile = UserProfile.forUser(user);

        assertThat(ProfileCompletion.calculate(user, profile)).isLessThanOrEqualTo(100);
    }
}
