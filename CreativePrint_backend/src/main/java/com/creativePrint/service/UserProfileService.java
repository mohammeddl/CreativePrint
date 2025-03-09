package com.creativePrint.service;

import com.creativePrint.dto.userprofile.req.UserProfileRequestDTO;
import com.creativePrint.dto.userprofile.resp.UserProfileResponseDTO;
import com.creativePrint.model.User;
import com.creativePrint.model.UserProfile;

public interface UserProfileService {
    UserProfileResponseDTO getProfileByUserId(Long userId);
    UserProfileResponseDTO updateProfile(User user, UserProfileRequestDTO dto) throws Exception;
}