package com.creativePrint.service.impl;

import com.creativePrint.enums.OrderStatus;
import com.creativePrint.model.Order;
import com.creativePrint.model.User;
import com.creativePrint.service.OrderNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderNotificationServiceImpl implements OrderNotificationService {

    private final JavaMailSender emailSender;

    @Override
    public void notifyOrderStatusChange(Order order, OrderStatus oldStatus, OrderStatus newStatus, User updatedBy) {
        log.info("Order {} status changed from {} to {}", order.getId(), oldStatus, newStatus);

        // Send email to buyer
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getBuyer().getEmail());
            message.setSubject("Order #" + order.getId() + " Status Update");
            message.setText("Your order status has been updated from " + oldStatus + " to " + newStatus);
            emailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send order status notification email", e);
        }

        // If the order has a partner product, notify the partner
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            // In a real application, you'd aggregate by partner and send one notification per partner
            // For simplicity, we'll just log it here
            log.info("Would notify partners of order status change");
        }
    }

    @Override
    public void notifyOrderCreated(Order order) {
        log.info("New order created: {}", order.getId());

        // Send confirmation email to buyer
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getBuyer().getEmail());
            message.setSubject("Order #" + order.getId() + " Confirmation");
            message.setText("Thank you for your order! Your order #" + order.getId() + " has been received.");
            emailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email", e);
        }
    }
}