package dev.serge.javastart.infrastructure.mail;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.mail")
public record AppMailProperties(
    String provider,
    String from,
    String support,
    String frontendUrl,
    long verificationTtlSeconds,
    Smtp smtp) {
  public record Smtp(
      String host,
      int port,
      boolean secure,
      boolean requireTls,
      String username,
      String password,
      String appPassword) {}
}
