package com.creativePrint.dto.product.resp;

public record ProductVariantDTO(
        Long id,
        String size,
        String color,
        Double priceAdjustment,
        Integer stock
) {}