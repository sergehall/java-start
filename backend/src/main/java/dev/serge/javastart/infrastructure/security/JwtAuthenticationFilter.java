package dev.serge.javastart.infrastructure.security;

import dev.serge.javastart.application.SessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final SessionService sessionService;

  public JwtAuthenticationFilter(JwtService jwtService, SessionService sessionService) {
    this.jwtService = jwtService;
    this.sessionService = sessionService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    bearerToken(request)
        .flatMap(jwtService::parse)
        .filter(sessionService::active)
        .ifPresent(
            principal -> {
              var authentication =
                  new UsernamePasswordAuthenticationToken(
                      principal, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
              SecurityContextHolder.getContext().setAuthentication(authentication);
            });
    filterChain.doFilter(request, response);
  }

  private java.util.Optional<String> bearerToken(HttpServletRequest request) {
    String value = request.getHeader("Authorization");
    if (value == null || !value.startsWith("Bearer ")) {
      return java.util.Optional.empty();
    }
    return java.util.Optional.of(value.substring("Bearer ".length()));
  }
}
