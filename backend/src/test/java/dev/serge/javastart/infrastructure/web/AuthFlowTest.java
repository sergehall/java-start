package dev.serge.javastart.infrastructure.web;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.serge.javastart.bootstrap.JavaStartApplication;
import dev.serge.javastart.infrastructure.mail.EmailTokenGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(classes = JavaStartApplication.class)
@AutoConfigureMockMvc
@Import(AuthFlowTest.AuthFlowTestConfig.class)
class AuthFlowTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @Test
  void registersLogsInAndReadsProfile() throws Exception {
    String email = "serge-%d@example.com".formatted(System.nanoTime());
    String registerBody =
        """
                {
                  "email": "%s",
                  "username": "Serge",
                  "password": "strong-password"
                }
                """
            .formatted(email);

    mockMvc
        .perform(
            post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.state").value("email_verification_required"))
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.verificationEmailQueued").value(true));

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {
                                  "email": "%s",
                                  "password": "strong-password"
                                }
                                """
                        .formatted(email)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.reason").value("email_not_verified"));

    String verifyResponse =
        mockMvc
            .perform(
                post("/api/v1/auth/email/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                                    {
                                      "token": "test-email-token"
                                    }
                                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", notNullValue()))
            .andExpect(jsonPath("$.user.email").value(email))
            .andExpect(jsonPath("$.user.emailVerified").value(true))
            .andReturn()
            .getResponse()
            .getContentAsString();

    JsonNode json = objectMapper.readTree(verifyResponse);
    String token = json.get("token").asText();

    mockMvc
        .perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("Serge"));

    mockMvc
        .perform(
            put("/api/v1/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                                {
                                  "learningState": "BUILDING",
                                  "energyLevel": 82,
                                  "learningGoal": "Understand Spring Boot auth",
                                  "nextStep": "Write one controller test"
                                }
                                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.learningState").value("BUILDING"))
        .andExpect(jsonPath("$.completion").value(100));

    mockMvc
        .perform(post("/api/v1/auth/logout").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    mockMvc
        .perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void rejectsProtectedEndpointWithoutToken() throws Exception {
    mockMvc.perform(get("/api/v1/profile")).andExpect(status().isUnauthorized());
  }

  @Test
  void appliesSecurityHeaders() throws Exception {
    mockMvc
        .perform(get("/api/v1/options/learning-states"))
        .andExpect(status().isOk())
        .andExpect(header().string("X-Content-Type-Options", "nosniff"))
        .andExpect(
            header()
                .string(
                    "Content-Security-Policy",
                    org.hamcrest.Matchers.containsString("frame-ancestors 'none'")))
        .andExpect(header().doesNotExist("X-Frame-Options"));
  }

  @TestConfiguration
  static class AuthFlowTestConfig {
    @Bean
    @Primary
    EmailTokenGenerator emailTokenGenerator() {
      return () -> "test-email-token";
    }
  }
}
