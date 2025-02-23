package com.creativePrint.dto.userprofile.req;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.Size;

public record UserProfileRequestDTO(
    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    String bio,

    @URL(message = "Invalid website URL")
    String website,

    String socialMediaLinks
) {}