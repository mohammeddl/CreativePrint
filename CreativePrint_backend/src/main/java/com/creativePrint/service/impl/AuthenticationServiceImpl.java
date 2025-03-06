package com.creativePrint.service.impl;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.req.ClientRegistrationRequest;
import com.creativePrint.dto.req.PartnerRegistrationRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.exception.entitesCustomExceptions.UnauthorizedException;
import com.creativePrint.model.Token;
import com.creativePrint.enums.Role;
import com.creativePrint.enums.TokenType;
import com.creativePrint.model.Client;
import com.creativePrint.model.Partner;
import com.creativePrint.model.User;
import com.creativePrint.model.UserProfile;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.security.JwtService;
import com.creativePrint.service.AuthenticationService;
import com.creativePrint.service.EmailMarketingService;
import com.creativePrint.mapper.ClientMapper;
import com.creativePrint.mapper.PartnerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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
    private final EmailMarketingService emailMarketingService;
    private final ClientMapper clientMapper;
    private final PartnerMapper partnerMapper;

    @Override
    @Transactional
    public AuthResponse registerClient(ClientRegistrationRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new UnauthorizedException("Email already registered");
        }

        // Map ClientRegistrationRequest to Client entity
        Client client = clientMapper.toEntity(request);

        // Set common fields
        client.setPassword(passwordEncoder.encode(request.password()));
        client.setRole(Role.CLIENT);
        client.setActive(true);
        client.setCreatedAt(Instant.now());

        // Save the client
        User savedUser = userRepository.save(client);

        // Create and associate user profile
        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .build();

        userProfileRepository.save(profile);
        savedUser.setUserProfile(profile);
        userRepository.save(savedUser);

        // Generate and save token
        var jwtToken = jwtService.generateToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        // Send welcome email
        emailMarketingService.sendWelcomeEmail(savedUser);

        return new AuthResponse(
                jwtToken,
                "Bearer",
                client.getRole().name(),
                client.getId().toString(),
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                LocalDateTime.now().plusDays(1)
        );
    }

    @Override
    @Transactional
    public AuthResponse registerPartner(PartnerRegistrationRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration attempt with existing email: {}", request.email());
            throw new UnauthorizedException("Email already registered");
        }

        // Map PartnerRegistrationRequest to Partner entity
        Partner partner = partnerMapper.toEntity(request);

        // Set common fields
        partner.setPassword(passwordEncoder.encode(request.password()));
        partner.setRole(Role.PARTNER);
        partner.setActive(true);
        partner.setCreatedAt(Instant.now());

        // Save the partner
        User savedUser = userRepository.save(partner);

        // Create and associate user profile
        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .build();

        userProfileRepository.save(profile);
        savedUser.setUserProfile(profile);
        userRepository.save(savedUser);

        // Generate and save token
        var jwtToken = jwtService.generateToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        // Send welcome email
        emailMarketingService.sendWelcomeEmail(savedUser);

        return new AuthResponse(
                jwtToken,
                "Bearer",
                partner.getRole().name(),
                partner.getId().toString(),
                partner.getFirstName(),
                partner.getLastName(),
                partner.getEmail(),
                LocalDateTime.now().plusDays(1)
        );
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
                user.getId().toString(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                LocalDateTime.now().plusDays(1)
        );
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