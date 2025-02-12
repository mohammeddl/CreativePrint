package com.creativePrint.dto.req;

import jakarta.validation.constraints.*;

public record PartnerRegistrationRequest(
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

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    String companyName,

    @NotBlank(message = "Business type is required")
    @Pattern(regexp = "^(MANUFACTURER|SUPPLIER|RETAILER|WHOLESALER)$", 
            message = "Invalid business type. Must be MANUFACTURER, SUPPLIER, RETAILER, or WHOLESALER")
    String businessType,

    @NotBlank(message = "Tax ID is required")
    @Pattern(regexp = "^[A-Z]{2}[0-9]{9}$", message = "Invalid Tax ID format. Must be 2 uppercase letters followed by 9 digits")
    String taxId,

    @NotNull(message = "Commission rate is required")
    @DecimalMin(value = "0.0", message = "Commission rate must be greater than or equal to 0")
    @DecimalMax(value = "100.0", message = "Commission rate must be less than or equal to 100")
    Double commissionRate
) {}