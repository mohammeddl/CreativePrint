package com.creativePrint.dto.req;

import jakarta.validation.constraints.*;

public record AdminRegistrationRequest(
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "First name can only contain letters and spaces")
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Last name can only contain letters and spaces")
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    String email,

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
        message = "Password must be at least 8 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character"
    )
    String password,

    @NotBlank(message = "Admin code is required")
    @Pattern(regexp = "^ADM-[0-9]{6}$", message = "Invalid admin code format. Must be in format ADM-XXXXXX")
    String adminCode,

    @NotBlank(message = "Department is required")
    @Size(min = 2, max = 50, message = "Department must be between 2 and 50 characters")
    String department

) {}
