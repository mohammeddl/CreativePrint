package com.creativePrint.dto.order.resp;

import java.time.Instant;
import java.util.List;

import com.creativePrint.dto.resp.UserResponse;
import com.creativePrint.enums.OrderStatus;

public record OrderResponse(
    Long id,
    UserResponse buyer,
    List<OrderItemResponse> items,
    Double totalPrice,
    OrderStatus status,
    Instant createdAt
) {}