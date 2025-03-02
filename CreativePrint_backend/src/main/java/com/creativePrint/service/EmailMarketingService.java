package com.creativePrint.service;

import com.creativePrint.model.User;

import java.util.Map;

public interface EmailMarketingService {
    void sendWelcomeEmail(User user);
    void sendAbandonedCartEmail(User user, Long cartId);
    void sendNewProductsEmail(User user);
}