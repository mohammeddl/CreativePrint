package com.creativePrint.service;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.dto.req.UserRegistrationRequest;

public interface AuthenticationService {

    AuthResponse register(UserRegistrationRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String token);
    
}
