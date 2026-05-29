package dev.serge.javastart.infrastructure.mail;

import java.security.SecureRandom;
import java.util.Base64;

public class SecureEmailTokenGenerator implements EmailTokenGenerator {
  private final SecureRandom secureRandom = new SecureRandom();

  @Override
  public String generateToken() {
    byte[] bytes = new byte[32];
    secureRandom.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}
