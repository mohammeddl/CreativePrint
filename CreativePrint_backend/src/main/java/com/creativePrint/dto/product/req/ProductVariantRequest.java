package com.creativePrint.dto.product.req;

public record ProductVariantRequest(
    String size,
    String color,
    Double priceAdjustment,
    Integer stock
) {}