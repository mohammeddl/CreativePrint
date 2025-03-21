package com.creativePrint.controller.admin;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.creativePrint.dto.resp.UserResponse;
import com.creativePrint.model.User;
import com.creativePrint.enums.Role;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.mapper.UserMapper;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<User> usersPage;

        // Apply filters if provided
        if (search != null && !search.isEmpty()) {
            usersPage = userRepository.searchUsers(search, pageable);
        } else if (role != null && !role.isEmpty()) {
            Role roleEnum = Role.valueOf(role);
            boolean active = status != null && status.equals("active");
            usersPage = userRepository.findByRoleAndActive(roleEnum, active, pageable);
        } else if (status != null && !status.isEmpty()) {
            boolean active = status.equals("active");
            usersPage = userRepository.findByActive(active, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        // Convert to response DTOs
        Page<UserResponse> userResponsePage = usersPage.map(userMapper::toResponse);

        // Create response with pagination info
        Map<String, Object> response = new HashMap<>();
        response.put("content", userResponsePage.getContent());
        response.put("totalPages", userResponsePage.getTotalPages());
        response.put("totalElements", userResponsePage.getTotalElements());
        response.put("number", userResponsePage.getNumber());
        response.put("size", userResponsePage.getSize());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> statusUpdate) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update user status
        boolean active = statusUpdate.get("active");
        user.setActive(active);
        user = userRepository.save(user);

        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Only allow deletion of non-admin users
        if (user.getRole() == Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}