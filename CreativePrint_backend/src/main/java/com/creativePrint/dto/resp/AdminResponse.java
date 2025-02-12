package com.creativePrint.dto.resp;

public record AdminResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String adminCode,
    String department,
    String accessLevel,
    boolean active
) {}