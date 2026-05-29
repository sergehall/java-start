package dev.serge.javastart.infrastructure.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggingMailProvider implements MailProvider {
  private static final Logger log = LoggerFactory.getLogger(LoggingMailProvider.class);

  @Override
  public void send(EmailMessage message) {
    log.info(
        "Mail provider=log to={} subject={} textBody={}",
        message.to(),
        message.subject(),
        message.textBody());
  }

  @Override
  public String name() {
    return "log";
  }
}
