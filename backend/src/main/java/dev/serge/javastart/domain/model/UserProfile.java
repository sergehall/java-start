package dev.serge.javastart.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserAccount user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private LearningState learningState = LearningState.CURIOUS;

    @Column(nullable = false)
    private int energyLevel = 65;

    @Column(nullable = false, length = 160)
    private String learningGoal = "Build my first Java + Next.js app";

    @Column(nullable = false, length = 240)
    private String nextStep = "Register, log in, and make the cabinet feel yours.";

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected UserProfile() {
    }

    private UserProfile(UserAccount user) {
        this.user = user;
    }

    public static UserProfile forUser(UserAccount user) {
        return new UserProfile(user);
    }

    public UUID id() {
        return id;
    }

    public UserAccount user() {
        return user;
    }

    public LearningState learningState() {
        return learningState;
    }

    public int energyLevel() {
        return energyLevel;
    }

    public String learningGoal() {
        return learningGoal;
    }

    public String nextStep() {
        return nextStep;
    }

    public Instant updatedAt() {
        return updatedAt;
    }

    public void update(LearningState learningState, int energyLevel, String learningGoal, String nextStep) {
        if (energyLevel < 0 || energyLevel > 100) {
            throw new IllegalArgumentException("Energy level must be between 0 and 100.");
        }
        this.learningState = learningState;
        this.energyLevel = energyLevel;
        this.learningGoal = learningGoal.trim();
        this.nextStep = nextStep.trim();
        this.updatedAt = Instant.now();
    }
}
