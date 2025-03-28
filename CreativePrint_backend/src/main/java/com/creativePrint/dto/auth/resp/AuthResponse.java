package com.creativePrint.dto.auth.resp;

import java.time.LocalDateTime;

public record AuthResponse(
    String token,
    String type,
    String role,
    String userId,
    String firstName,
    String lastName,
    String email,
    LocalDateTime expiresAt
) {}
