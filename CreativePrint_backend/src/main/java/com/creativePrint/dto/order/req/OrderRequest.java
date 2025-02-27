package com.creativePrint.dto.order.req;

import java.util.List;

import jakarta.validation.constraints.*;

public record OrderRequest(
    @NotNull Long buyerId,
    @NotEmpty List<OrderItemRequest> items
) {}