package com.creativePrint.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creativePrint.enums.Role;
import com.creativePrint.exception.entitesCustomExceptions.BadRequestException;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;
import com.creativePrint.model.User;
import com.creativePrint.repository.TokenRepository;
import com.creativePrint.repository.UserInteractionRepository;
import com.creativePrint.repository.UserProfileRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInteractionRepository userInteractionRepository;
   
    @Transactional
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete admin users");
        }
        userInteractionRepository.deleteByUserId(userId);
        userProfileRepository.findByUser_Id(userId).ifPresent(userProfileRepository::delete);
        tokenRepository.deleteByUserId(userId);
        userRepository.delete(user);
    }
    
}
