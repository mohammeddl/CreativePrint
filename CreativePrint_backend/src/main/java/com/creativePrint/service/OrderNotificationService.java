package com.creativePrint.service;

import com.creativePrint.enums.OrderStatus;
import com.creativePrint.model.Order;
import com.creativePrint.model.User;

public interface OrderNotificationService {
    void notifyOrderStatusChange(Order order, OrderStatus oldStatus, OrderStatus newStatus, User updatedBy);
    void notifyOrderCreated(Order order);
}