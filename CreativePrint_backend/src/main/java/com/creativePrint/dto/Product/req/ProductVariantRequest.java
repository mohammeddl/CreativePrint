package com.creativePrint.dto.Product.req;

import jakarta.validation.constraints.PositiveOrZero;

public record ProductVariantRequest(
    String size,
    String color,
    @PositiveOrZero Double priceAdjustment,
    @PositiveOrZero Integer stock
) {}