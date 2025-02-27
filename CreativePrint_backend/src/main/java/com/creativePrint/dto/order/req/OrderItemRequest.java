package com.creativePrint.dto.order.req;

import jakarta.validation.constraints.*;

public record OrderItemRequest(
    @NotNull Long variantId,
    @Min(1) Integer quantity
) {}