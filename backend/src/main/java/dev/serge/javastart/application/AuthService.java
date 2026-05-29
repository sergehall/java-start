package dev.serge.javastart.application;

import dev.serge.javastart.application.dto.AuthResponse;
import dev.serge.javastart.application.dto.LoginRequest;
import dev.serge.javastart.application.dto.RegisterRequest;
import dev.serge.javastart.application.dto.UserSummary;
import dev.serge.javastart.domain.model.UserAccount;
import dev.serge.javastart.domain.model.UserProfile;
import dev.serge.javastart.infrastructure.persistence.UserAccountRepository;
import dev.serge.javastart.infrastructure.persistence.UserProfileRepository;
import dev.serge.javastart.infrastructure.security.JwtService;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final UserProfileRepository profiles;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository users,
            UserProfileRepository profiles,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.users = users;
        this.profiles = profiles;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = UserAccount.normalizeEmail(request.email());
        if (users.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();
        }
        UserAccount user = users.save(UserAccount.register(
                email,
                request.displayName(),
                passwordEncoder.encode(request.password())
        ));
        profiles.save(UserProfile.forUser(user));
        return issueToken(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserAccount user = users.findByEmail(UserAccount.normalizeEmail(request.email()))
                .filter(found -> passwordEncoder.matches(request.password(), found.passwordHash()))
                .orElseThrow(InvalidCredentialsException::new);
        return issueToken(user);
    }

    @Transactional(readOnly = true)
    public UserSummary me(UUID userId) {
        return users.findById(userId)
                .map(UserSummary::from)
                .orElseThrow(InvalidCredentialsException::new);
    }

    private AuthResponse issueToken(UserAccount user) {
        return new AuthResponse(jwtService.createToken(user), UserSummary.from(user));
    }
}
