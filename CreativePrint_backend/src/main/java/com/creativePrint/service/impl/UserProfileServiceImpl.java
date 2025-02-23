package com.creativePrint.service.impl;

import org.springframework.stereotype.Service;

import com.creativePrint.dto.userprofile.req.UserProfileRequestDTO;
import com.creativePrint.dto.userprofile.resp.UserProfileResponseDTO;
import com.creativePrint.exception.entitesCustomExceptions.UserProfileNotFoundException;
import com.creativePrint.model.User;
import com.creativePrint.model.UserProfile;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.service.UserProfileService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userProfileRepository;

@Override
@Transactional(readOnly = true)
public UserProfileResponseDTO getProfileByUserId(Long userId) {
    UserProfile profile = userProfileRepository.findByUser_Id(userId)
        .orElseThrow(() -> new UserProfileNotFoundException(userId));
    
    return new UserProfileResponseDTO(
        profile.getId(),
        profile.getBio(),
        profile.getWebsite(),
        profile.getSocialMediaLinks()
    );
}


@Override
@Transactional
public UserProfileResponseDTO updateProfile(User user, UserProfileRequestDTO dto) {
    UserProfile profile = user.getUserProfile();
    profile.setBio(dto.bio());
    profile.setWebsite(dto.website());
    profile.setSocialMediaLinks(dto.socialMediaLinks());
    userProfileRepository.save(profile);

    return new UserProfileResponseDTO(
        profile.getId(),
        profile.getBio(),
        profile.getWebsite(),
        profile.getSocialMediaLinks()
    );
}
}