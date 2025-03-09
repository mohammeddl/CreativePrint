package com.creativePrint.dto.userprofile.resp;

public record UserProfileResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String bio,
        String website,
        String socialMediaLinks,
        String profilePicture,
        String role
) {}