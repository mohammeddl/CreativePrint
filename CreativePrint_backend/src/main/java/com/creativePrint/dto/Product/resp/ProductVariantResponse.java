package com.creativePrint.dto.Product.resp;

public record ProductVariantResponse(
    Long id,
    String size,
    String color,
    Double priceAdjustment,
    Integer stock
) {}
