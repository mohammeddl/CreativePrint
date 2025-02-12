package com.creativePrint.service.impl;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.req.UserRegistrationRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.exception.entitesCustomExceptions.UnauthorizedException;
import com.creativePrint.model.Token;
import com.creativePrint.enums.Role;
import com.creativePrint.enums.TokenType;
import com.creativePrint.model.User;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.security.JwtService;
import com.creativePrint.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(UserRegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.email());

        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration attempt with existing email: {}", request.email());
            throw new UnauthorizedException("Email already registered");
        }

        try {
            // Create new user
            var user = User.builder()
                    .firstName(request.firstName())
                    .lastName(request.lastName())
                    .email(request.email())
                    .password(passwordEncoder.encode(request.password()))
                    .role(Role.valueOf(request.role().toUpperCase()))
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            var savedUser = userRepository.save(user);
            var jwtToken = jwtService.generateToken(user);
            
            saveUserToken(savedUser, jwtToken);

            log.info("Successfully registered user with email: {}", request.email());
            
            return new AuthResponse(
                jwtToken,
                "Bearer",
                user.getRole().name(),
                LocalDateTime.now().plusDays(1)
            );
        } catch (Exception e) {
            log.error("Error during user registration: {}", e.getMessage());
            throw new RuntimeException("Registration failed", e);
        }
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
                )
            );

            if (!authentication.isAuthenticated()) {
                log.warn("Authentication failed for email: {}", request.email());
                throw new UnauthorizedException("Invalid credentials");
            }

            var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

            if (!user.isActive()) {
                log.warn("Login attempt for inactive account: {}", request.email());
                throw new UnauthorizedException("Account is inactive");
            }

            var jwtToken = jwtService.generateToken(user);
            
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            log.info("Successfully logged in user: {}", request.email());

            return new AuthResponse(
                jwtToken,
                "Bearer",
                user.getRole().name(),
                LocalDateTime.now().plusDays(1)
            );
        } catch (BadCredentialsException e) {
            log.warn("Invalid credentials for email: {}", request.email());
            throw new UnauthorizedException("Invalid credentials");
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage());
            throw new RuntimeException("Login failed", e);
        }
    }

    @Override
    @Transactional
    public void logout(String token) {
        log.info("Processing logout request");

        if (token == null || token.isEmpty()) {
            log.warn("Logout attempt with null or empty token");
            throw new UnauthorizedException("Invalid token");
        }

        try {
            var storedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));
                
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            
            log.info("Successfully logged out user");
        } catch (Exception e) {
            log.error("Error during logout: {}", e.getMessage());
            throw new RuntimeException("Logout failed", e);
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        try {
            var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
            tokenRepository.save(token);
        } catch (Exception e) {
            log.error("Error saving user token: {}", e.getMessage());
            throw new RuntimeException("Failed to save user token", e);
        }
    }

    private void revokeAllUserTokens(User user) {
        try {
            var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
            if (validUserTokens.isEmpty()) {
                return;
            }
            
            validUserTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            
            tokenRepository.saveAll(validUserTokens);
        } catch (Exception e) {
            log.error("Error revoking user tokens: {}", e.getMessage());
            throw new RuntimeException("Failed to revoke user tokens", e);
        }
    }

    // Helper method to extract token from request
    private String extractTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}