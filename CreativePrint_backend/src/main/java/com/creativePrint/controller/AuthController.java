package com.creativePrint.controller;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.req.ClientRegistrationRequest;
import com.creativePrint.dto.req.PartnerRegistrationRequest;
import com.creativePrint.service.impl.AuthenticationServiceImpl;
import com.creativePrint.dto.auth.resp.AuthResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {
    private final AuthenticationServiceImpl authenticationService;

    @PostMapping("/register-client")
    @Operation(summary = "Register a new client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Email already registered")
    })
    public ResponseEntity<AuthResponse> registerClient(
            @Valid @RequestBody ClientRegistrationRequest request) {
        return ResponseEntity.ok(authenticationService.registerClient(request));
    }

    @PostMapping("/register-partner")
    @Operation(summary = "Register a new partner")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Partner registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Email already registered")
    })
    public ResponseEntity<AuthResponse> registerPartner(
            @Valid @RequestBody PartnerRegistrationRequest request) {
        return ResponseEntity.ok(authenticationService.registerPartner(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged in successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials or inactive account")
    })
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged out successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid token")
    })
    public ResponseEntity<Void> logout(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authenticationService.logout(token);
        }
        return ResponseEntity.ok().build();
    }
}