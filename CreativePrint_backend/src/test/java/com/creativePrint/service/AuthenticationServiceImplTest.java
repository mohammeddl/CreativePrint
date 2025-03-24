package com.creativePrint.service;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.model.User;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.security.JwtService;
import com.creativePrint.service.impl.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private TokenRepository tokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    @BeforeEach
    void setUp() {
        // Add common setup if needed
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        // Arrange
        LoginRequest request = new LoginRequest("test@example.com", "password");
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(user, request.password()));
        when(jwtService.generateToken(user)).thenReturn("test-token");

        // Act
        AuthResponse response = authenticationService.login(request);

        // Assert
        assertEquals("test-token", response.token());
        assertEquals("Bearer", response.type());
        assertEquals(user.getRole().name(), response.role());
        assertEquals(user.getId().toString(), response.userId());
    }

}