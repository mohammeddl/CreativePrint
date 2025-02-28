package com.creativePrint.service;

import java.util.List;


import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.dto.order.resp.OrderStatusHistoryResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    List<OrderResponse> getOrderHistory(Long userId);
    OrderResponse getOrderById(Long orderId);
    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, User updatedBy);
    List<OrderStatusHistoryResponse> getOrderStatusHistory(Long orderId);
    boolean canUpdateToStatus(OrderStatus currentStatus, OrderStatus newStatus);

    Page<OrderResponse> getAllOrders(Pageable pageable);
    Page<OrderResponse> getOrdersByDesignCreator(Long partnerId, Pageable pageable);
    boolean isOrderContainingPartnerDesigns(Long orderId, Long partnerId);
}