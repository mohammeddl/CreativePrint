package com.creativePrint.service;

import com.creativePrint.dto.auth.req.LoginRequest;
import com.creativePrint.dto.auth.resp.AuthResponse;
import com.creativePrint.dto.req.ClientRegistrationRequest;
import com.creativePrint.dto.req.PartnerRegistrationRequest;
import com.creativePrint.dto.req.UserRegistrationRequest;

public interface AuthenticationService {

    AuthResponse registerClient(ClientRegistrationRequest request);

    AuthResponse registerPartner(PartnerRegistrationRequest request);


    AuthResponse login(LoginRequest request);

    void logout(String token);

}
