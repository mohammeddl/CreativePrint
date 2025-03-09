package com.creativePrint.controller;

import com.creativePrint.dto.userprofile.req.UserProfileRequestDTO;
import com.creativePrint.dto.userprofile.resp.UserProfileResponseDTO;
import com.creativePrint.model.User;
import com.creativePrint.service.UserProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users/{userId}/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<UserProfileResponseDTO> getProfile(
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {
        if (!userId.equals(authenticatedUser.getId())) {
            throw new AccessDeniedException("You cannot access another user's profile");
        }
        return ResponseEntity.ok(userProfileService.getProfileByUserId(userId));
    }

    @PatchMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            @PathVariable Long userId,
            @ModelAttribute @Valid UserProfileRequestDTO dto,
            @AuthenticationPrincipal User authenticatedUser) throws Exception {
        if (!userId.equals(authenticatedUser.getId())) {
            throw new AccessDeniedException("Unauthorized profile update");
        }
        return ResponseEntity.ok(userProfileService.updateProfile(authenticatedUser, dto));
    }
}