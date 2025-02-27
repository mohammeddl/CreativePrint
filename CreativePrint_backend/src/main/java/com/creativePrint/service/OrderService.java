package com.creativePrint.service;

import java.util.List;


import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.enums.OrderStatus;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    List<OrderResponse> getOrderHistory(Long userId);
    OrderResponse updateOrderStatus(Long orderId,  OrderStatus status);
}