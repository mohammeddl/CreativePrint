package com.creativePrint.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.creativePrint.service.OrderService;

import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.model.Order;
import com.creativePrint.model.User;
import com.creativePrint.enums.OrderStatus;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Count total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        // Count total products
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);

        // Count total orders
        long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);

        // Calculate total revenue from completed orders
        double totalRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED ||
                        order.getStatus() == OrderStatus.PAYMENT_RECEIVED ||
                        order.getStatus() == OrderStatus.SHIPPED)
                .mapToDouble(Order::getTotalPrice)
                .sum();
        stats.put("totalRevenue", totalRevenue);

        // Get recent orders (limited to 5)
        List<Map<String, Object>> recentOrders = orderRepository.findAll().stream()
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
                .toList();
        stats.put("recentOrders", recentOrders);

        // Calculate monthly sales for the past 6 months
        List<Map<String, Object>> monthlySales = calculateMonthlySales();
        stats.put("monthlySales", monthlySales);

        return ResponseEntity.ok(stats);
    }

    private List<Map<String, Object>> calculateMonthlySales() {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Create entries for the last 6 months
        for (int i = 5; i >= 0; i--) {
            Map<String, Object> monthlySale = new HashMap<>();
            LocalDate monthDate = today.minusMonths(i);
            String monthName = monthDate.format(DateTimeFormatter.ofPattern("MMM"));

            monthlySale.put("month", monthName);

            // In a real implementation, you would query the database for the actual revenue for this month
            // This is a placeholder calculation
            double revenue = calculateRevenueForMonth(monthDate.getMonthValue(), monthDate.getYear());
            monthlySale.put("revenue", revenue);

            result.add(monthlySale);
        }

        return result;
    }

    private double calculateRevenueForMonth(int month, int year) {
        // In a real implementation, you would query the database for orders in this month and sum their totals
        // For now, we'll use a placeholder calculation
        return orderRepository.findAll().stream()
                .filter(order -> {
                    LocalDate orderDate = LocalDate.ofInstant(order.getCreatedAt(),
                            java.time.ZoneId.systemDefault());
                    return orderDate.getMonthValue() == month &&
                            orderDate.getYear() == year &&
                            (order.getStatus() == OrderStatus.DELIVERED ||
                                    order.getStatus() == OrderStatus.PAYMENT_RECEIVED ||
                                    order.getStatus() == OrderStatus.SHIPPED);
                })
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }
}