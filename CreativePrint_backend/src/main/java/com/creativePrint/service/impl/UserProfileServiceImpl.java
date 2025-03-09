package com.creativePrint.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.creativePrint.dto.userprofile.req.UserProfileRequestDTO;
import com.creativePrint.dto.userprofile.resp.UserProfileResponseDTO;
import com.creativePrint.exception.entitesCustomExceptions.UserProfileNotFoundException;
import com.creativePrint.model.User;
import com.creativePrint.model.UserProfile;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.service.CloudinaryService;
import com.creativePrint.service.UserProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDTO getProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository.findByUser_Id(userId)
                .orElseThrow(() -> new UserProfileNotFoundException(userId));

        return new UserProfileResponseDTO(
                profile.getId(),
                profile.getUser().getFirstName(),
                profile.getUser().getLastName(),
                profile.getUser().getEmail(),
                profile.getBio(),
                profile.getWebsite(),
                profile.getSocialMediaLinks(),
                profile.getProfilePicture(),
                profile.getUser().getRole().name()
        );
    }

    @Override
    @Transactional
    public UserProfileResponseDTO updateProfile(User user, UserProfileRequestDTO dto) throws Exception {
        UserProfile profile = user.getUserProfile();

        // Update text fields
        profile.setBio(dto.bio());
        profile.setWebsite(dto.website());
        profile.setSocialMediaLinks(dto.socialMediaLinks());

        // Handle profile picture upload
        if (dto.image() != null && !dto.image().isEmpty()) {
            // Delete existing profile picture if exists
            if (profile.getProfilePicture() != null) {
                try {
                    // Extract public ID from the existing URL and delete
                    String publicId = extractPublicIdFromUrl(profile.getProfilePicture());
                    cloudinaryService.deleteFile(publicId);
                } catch (Exception e) {
                    // Log the error but continue with upload
                    System.err.println("Error deleting existing profile picture: " + e.getMessage());
                }
            }

            // Upload new profile picture
            String profilePictureUrl = cloudinaryService.uploadFile(
                    dto.image(),
                    "profile_pictures/" + user.getId()
            );
            profile.setProfilePicture(profilePictureUrl);
        }

        // Save updated profile
        userProfileRepository.save(profile);

        return new UserProfileResponseDTO(
                profile.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                profile.getBio(),
                profile.getWebsite(),
                profile.getSocialMediaLinks(),
                profile.getProfilePicture(),
                user.getRole().name()
        );
    }

    // Helper method to extract public ID from Cloudinary URL
    private String extractPublicIdFromUrl(String url) {
        // This method assumes Cloudinary URL format
        // You might need to adjust this based on your exact Cloudinary URL structure
        String[] parts = url.split("/");
        String fileName = parts[parts.length - 1];
        return "profile_pictures/" + fileName.split("\\.")[0];
    }
}