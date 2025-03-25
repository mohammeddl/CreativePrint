package com.creativePrint.dto.product.resp;

public record ProductVariantResponse(
    Long id,
    String size,
    String color,
    Double priceAdjustment,
    Integer stock
) {}