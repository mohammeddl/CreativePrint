package com.creativePrint.dto.userprofile.resp;

public record UserProfileResponseDTO(
    Long id,
    String bio,
    String website,
    String socialMediaLinks
) {}