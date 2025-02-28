package com.creativePrint.dto.order.resp;

import com.creativePrint.enums.OrderStatus;
import java.time.Instant;

public record OrderStatusHistoryResponse(
        Long id,
        Long orderId,
        OrderStatus status,
        String notes,
        String updatedByName,
        Instant timestamp
) {}