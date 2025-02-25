package com.creativePrint.dto.Product.req;

public record ProductVariantRequest(
    String size,
    String color,
    Double priceAdjustment,
    Integer stock
) {}