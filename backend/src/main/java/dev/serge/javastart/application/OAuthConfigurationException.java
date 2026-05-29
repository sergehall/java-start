package dev.serge.javastart.application;

public class OAuthConfigurationException extends RuntimeException {
  public OAuthConfigurationException() {
    super("GitHub OAuth is not configured for this environment.");
  }
}
