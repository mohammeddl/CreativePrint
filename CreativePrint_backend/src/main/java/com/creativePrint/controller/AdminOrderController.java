package com.creativePrint.controller;

import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.dto.order.resp.OrderStatusHistoryResponse;
import com.creativePrint.model.User;
import com.creativePrint.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        // Implement method to get all orders with pagination
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody @Valid OrderStatusUpdateRequest request,
            @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request, admin));
    }

    @GetMapping("/{orderId}/status-history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderStatusHistoryResponse>> getOrderStatusHistory(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderStatusHistory(orderId));
    }
}