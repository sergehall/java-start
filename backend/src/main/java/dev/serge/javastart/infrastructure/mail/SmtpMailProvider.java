package dev.serge.javastart.infrastructure.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public class SmtpMailProvider implements MailProvider {
  private final JavaMailSender mailSender;
  private final String from;

  public SmtpMailProvider(JavaMailSender mailSender, String from) {
    this.mailSender = mailSender;
    this.from = from;
  }

  @Override
  public void send(EmailMessage message) {
    try {
      MimeMessage mimeMessage = mailSender.createMimeMessage();
      MimeMessageHelper helper =
          new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name());
      helper.setFrom(from);
      helper.setTo(message.to());
      helper.setSubject(message.subject());
      helper.setText(message.textBody(), message.htmlBody());
      mailSender.send(mimeMessage);
    } catch (MessagingException exception) {
      throw new MailDeliveryException("Could not build verification email.", exception);
    }
  }

  @Override
  public String name() {
    return "smtp";
  }
}
