package com.creativePrint.dto.Product.resp;

public record ProductVariantDTO(
        Long id,
        String size,
        String color,
        Double priceAdjustment,
        Integer stock
) {}