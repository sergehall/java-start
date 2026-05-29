package dev.serge.javastart.infrastructure.mail;

import java.time.Duration;
import java.util.Properties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
@EnableConfigurationProperties(AppMailProperties.class)
public class MailConfig {
  @Bean
  EmailTemplateRenderer emailTemplateRenderer() {
    return new EmailTemplateRenderer();
  }

  @Bean
  @ConditionalOnMissingBean(EmailTokenGenerator.class)
  EmailTokenGenerator emailTokenGenerator() {
    return new SecureEmailTokenGenerator();
  }

  @Bean
  MailProvider mailProvider(AppMailProperties properties) {
    if (!"smtp".equalsIgnoreCase(properties.provider())) {
      return new LoggingMailProvider();
    }

    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    AppMailProperties.Smtp smtp = properties.smtp();
    sender.setHost(smtp.host());
    sender.setPort(smtp.port());
    sender.setUsername(smtp.username());
    sender.setPassword(firstPresent(smtp.appPassword(), smtp.password()));
    sender.setDefaultEncoding("UTF-8");

    Properties mailProperties = sender.getJavaMailProperties();
    mailProperties.put("mail.smtp.auth", String.valueOf(!isBlank(smtp.username())));
    mailProperties.put("mail.smtp.starttls.enable", String.valueOf(smtp.requireTls()));
    mailProperties.put("mail.smtp.starttls.required", String.valueOf(smtp.requireTls()));
    mailProperties.put("mail.smtp.ssl.enable", String.valueOf(smtp.secure()));
    mailProperties.put(
        "mail.smtp.connectiontimeout", String.valueOf(Duration.ofSeconds(10).toMillis()));
    mailProperties.put("mail.smtp.timeout", String.valueOf(Duration.ofSeconds(10).toMillis()));
    mailProperties.put("mail.smtp.writetimeout", String.valueOf(Duration.ofSeconds(10).toMillis()));

    return new SmtpMailProvider(sender, properties.from());
  }

  private String firstPresent(String primary, String fallback) {
    if (!isBlank(primary)) {
      return primary;
    }
    return fallback;
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
