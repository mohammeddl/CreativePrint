package com.creativePrint.dto.order.req;

import com.creativePrint.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull OrderStatus status,
        String notes
) {}