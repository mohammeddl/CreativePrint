package com.creativePrint.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creativePrint.model.Design;
import com.creativePrint.model.Order;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;
import com.creativePrint.repository.DesignRepository;
import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/partner/dashboard")
@RequiredArgsConstructor
public class PartnerDashboardController {

    private final DesignRepository designRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User partner) {
        Map<String, Object> stats = new HashMap<>();

        // Count total designs
        long totalDesigns = designRepository.countByCreator(partner);
        stats.put("totalDesigns", totalDesigns);

        // Count total products
        long totalProducts = productRepository.countByDesignCreator(partner);
        stats.put("totalProducts", totalProducts);

        // Get orders with partner's designs
        List<Order> partnerOrders = orderRepository.findByItemsVariantProductDesignCreatorId(partner.getId());
        stats.put("totalOrders", partnerOrders.size());

        // Recent orders
        List<Map<String, Object>> recentOrders = partnerOrders.stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .limit(5)
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("id", order.getId());
                    orderMap.put("customer", order.getBuyer().getFirstName() + " " + order.getBuyer().getLastName());
                    orderMap.put("total", order.getTotalPrice());
                    orderMap.put("status", order.getStatus().toString());
                    orderMap.put("date", order.getCreatedAt().toString());
                    return orderMap;
                })
                .collect(Collectors.toList());
        stats.put("recentOrders", recentOrders);

        // Recent sales (last 7 days)
        List<Map<String, Object>> recentSales = calculateRecentSales(partnerOrders);
        stats.put("recentSales", recentSales);

        return ResponseEntity.ok(stats);
    }

    private List<Map<String, Object>> calculateRecentSales(List<Order> orders) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Create entries for the last 7 days
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> daySales = new HashMap<>();
            daySales.put("date", date.toString());
            daySales.put("amount", 0.0);
            result.add(daySales);
        }

        // Calculate sales for each day
        for (Order order : orders) {
            // Skip orders that don't have PAYMENT_RECEIVED, SHIPPED, or DELIVERED status
            if (!order.getStatus().toString().equals("PAYMENT_RECEIVED") &&
                    !order.getStatus().toString().equals("IN_PRODUCTION") &&
                    !order.getStatus().toString().equals("SHIPPED") &&
                    !order.getStatus().toString().equals("DELIVERED")) {
                continue;
            }

            // Convert order creation date to LocalDate
            LocalDate orderDate = Instant.ofEpochMilli(order.getCreatedAt().toEpochMilli())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

            // Check if the order is within the last 7 days
            if (orderDate.isAfter(today.minusDays(7).minusDays(1))) {
                // Find the matching day in our result list
                for (Map<String, Object> daySales : result) {
                    if (daySales.get("date").equals(orderDate.toString())) {
                        double currentAmount = (double) daySales.get("amount");
                        daySales.put("amount", currentAmount + order.getTotalPrice());
                        break;
                    }
                }
            }
        }

        return result;
    }
}