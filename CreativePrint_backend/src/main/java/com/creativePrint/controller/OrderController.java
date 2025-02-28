package com.creativePrint.controller;

import java.util.List;

import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderStatusHistoryResponse;
import com.creativePrint.enums.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.model.User;
import com.creativePrint.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderResponse> createOrder(
        @RequestBody @Valid OrderRequest request,
        @AuthenticationPrincipal User user
    ) {
        if (!user.getId().equals(request.buyerId())) {
            throw new AccessDeniedException("You can only create orders for yourself");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(orderService.createOrder(request));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(orderService.getOrderHistory(user.getId()));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderResponse> getOrderDetails(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user) {
        // Verify the order belongs to the user
        OrderResponse order = orderService.getOrderById(orderId);
        if (!order.buyer().id().equals(user.getId())) {
            throw new AccessDeniedException("You can only view your own orders");
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}/status-history")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<OrderStatusHistoryResponse>> getOrderStatusHistory(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user) {
        // Verify the order belongs to the user
        OrderResponse order = orderService.getOrderById(orderId);
        if (!order.buyer().id().equals(user.getId())) {
            throw new AccessDeniedException("You can only view history for your own orders");
        }
        return ResponseEntity.ok(orderService.getOrderStatusHistory(orderId));
    }

    @PatchMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user) {
        // Verify the order belongs to the user
        OrderResponse order = orderService.getOrderById(orderId);
        if (!order.buyer().id().equals(user.getId())) {
            throw new AccessDeniedException("You can only cancel your own orders");
        }

        // Client can only cancel if order is in PENDING, PENDING_PAYMENT, or PAYMENT_FAILED state
        OrderStatusUpdateRequest request = new OrderStatusUpdateRequest(
                OrderStatus.CANCELLED,
                "Cancelled by client"
        );

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request, user));
    }
}