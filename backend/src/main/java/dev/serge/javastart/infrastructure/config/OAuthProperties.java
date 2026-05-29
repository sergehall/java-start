package dev.serge.javastart.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.oauth")
public record OAuthProperties(GitHub github) {
  public OAuthProperties {
    if (github == null) {
      github = new GitHub("", "", "http://localhost:3000/auth/oauth/github/callback");
    }
  }

  public record GitHub(String clientId, String clientSecret, String redirectUri) {}
}
