package dev.serge.javastart.bootstrap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "dev.serge.javastart")
@EntityScan("dev.serge.javastart.domain.model")
@EnableJpaRepositories("dev.serge.javastart.infrastructure.persistence")
public class JavaStartApplication {
  public static void main(String[] args) {
    SpringApplication.run(JavaStartApplication.class, args);
  }
}
