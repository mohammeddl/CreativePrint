package com.creativePrint.exception.entitesCustomExceptions;

public class UserProfileNotFoundException extends RuntimeException {
    public UserProfileNotFoundException(Long userId) {
        super("Profile not found for user ID: " + userId);
    }
}