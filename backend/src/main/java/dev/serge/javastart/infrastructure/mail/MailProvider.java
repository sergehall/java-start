package dev.serge.javastart.infrastructure.mail;

public interface MailProvider {
  void send(EmailMessage message);

  String name();
}
