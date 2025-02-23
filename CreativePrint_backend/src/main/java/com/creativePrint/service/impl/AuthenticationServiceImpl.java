package com.creativePrint.service.impl;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.req.UserRegistrationRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.exception.entitesCustomExceptions.UnauthorizedException;
import com.creativePrint.model.Token;
import com.creativePrint.enums.Role;
import com.creativePrint.enums.TokenType;
import com.creativePrint.model.User;
import com.creativePrint.model.UserProfile;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.security.JwtService;
import com.creativePrint.service.AuthenticationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
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
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public AuthResponse register(UserRegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.email());
    
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration attempt with existing email: {}", request.email());
            throw new UnauthorizedException("Email already registered");
        }
    
        // Build and save the user first
        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.valueOf(request.role().toUpperCase()))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
    
        var savedUser = userRepository.save(user); // User is persisted here
    
        // Create and save the profile
        UserProfile profile = UserProfile.builder()
                .user(savedUser) // Link to the saved user
                .build();
    
        userProfileRepository.save(profile); // Persist the profile
    
        // Optionally link the profile to the user (for bidirectional consistency)
        savedUser.setUserProfile(profile);
        userRepository.save(savedUser); // Update the user (optional)
    
        // Generate JWT and return response
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedUser, jwtToken);
    
        log.info("Successfully registered user with email: {}", request.email());
        return new AuthResponse(
                jwtToken,
                "Bearer",
                user.getRole().name(),
                LocalDateTime.now().plusDays(1));
    }
    
    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));

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

        return new AuthResponse(
                jwtToken,
                "Bearer",
                user.getRole().name(),
                LocalDateTime.now().plusDays(1));
    }

    @Override
    @Transactional
    public void logout(String token) {
        log.info("Processing logout request");

        if (token == null || token.isEmpty()) {
            log.warn("Logout attempt with null or empty token");
            throw new UnauthorizedException("Invalid token");
        }

        var storedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid token"));

        storedToken.setExpired(true);
        storedToken.setRevoked(true);
        tokenRepository.save(storedToken);

        log.info("Successfully logged out user");
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (!validUserTokens.isEmpty()) {
            validUserTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(validUserTokens);
        }
    }
}