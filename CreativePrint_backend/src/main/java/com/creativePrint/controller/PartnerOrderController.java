package com.creativePrint.controller;

import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.model.User;
import com.creativePrint.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partner/orders")
@RequiredArgsConstructor
public class PartnerOrderController {
    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Page<OrderResponse>> getPartnerOrders(
            @AuthenticationPrincipal User partner,
            @PageableDefault(size = 20) Pageable pageable) {
        // Get orders containing products with designs created by this partner
        return ResponseEntity.ok(orderService.getOrdersByDesignCreator(partner.getId(), pageable));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody @Valid OrderStatusUpdateRequest request,
            @AuthenticationPrincipal User partner) {
        // Verify this order contains partner's products before allowing update
        if (!orderService.isOrderContainingPartnerDesigns(orderId, partner.getId())) {
            throw new AccessDeniedException("You can only update orders containing your designs");
        }

        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request, partner));
    }
}