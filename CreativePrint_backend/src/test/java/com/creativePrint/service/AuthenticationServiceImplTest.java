package com.creativePrint.service;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.enums.Role;
import com.creativePrint.exception.entitesCustomExceptions.UnauthorizedException;
import com.creativePrint.model.User;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.security.JwtService;
import com.creativePrint.service.EmailMarketingService;
import com.creativePrint.service.impl.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceImplTest {

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

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private EmailMarketingService emailMarketingService;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    private User testUser;
    private LoginRequest loginRequest;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(Role.CLIENT)
                .active(true)
                .createdAt(Instant.now())
                .build();

        loginRequest = new LoginRequest("test@example.com", "password123");


    }

    @Test
    void loginSuccess_ReturnsAuthResponse() {

        authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(loginRequest.email())).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(testUser)).thenReturn("test-jwt-token");
        
        AuthResponse response = authenticationService.login(loginRequest);


        assertNotNull(response);
        assertEquals("Bearer", response.type());
        assertEquals(testUser.getRole().name(), response.role());
        assertEquals(testUser.getId().toString(), response.userId());
        assertEquals(testUser.getFirstName(), response.firstName());
        assertEquals(testUser.getLastName(), response.lastName());
        assertEquals(testUser.getEmail(), response.email());


        verify(jwtService).generateToken(testUser);
        verify(tokenRepository).findAllValidTokensByUser(testUser.getId());
    }

    @Test
    void loginWithInactiveAccount_ThrowsUnauthorizedException() {

        authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);

        testUser.setActive(false);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(loginRequest.email())).thenReturn(Optional.of(testUser));


        assertThrows(UnauthorizedException.class, () -> authenticationService.login(loginRequest));
    }

    @Test
    void loginWithInvalidCredentials_ThrowsUnauthorizedException() {

        authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(false);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);


        assertThrows(UnauthorizedException.class, () -> authenticationService.login(loginRequest));
    }

    @Test
    void logout_RevokesToken() {

        String token = "valid-token";
        var storedToken = com.creativePrint.model.Token.builder()
                .token(token)
                .expired(false)
                .revoked(false)
                .user(testUser)
                .build();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(storedToken));
        
        authenticationService.logout(token);


        assertTrue(storedToken.isExpired());
        assertTrue(storedToken.isRevoked());
        verify(tokenRepository).save(storedToken);
    }
}