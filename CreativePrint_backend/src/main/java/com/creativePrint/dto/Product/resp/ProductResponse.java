package com.creativePrint.dto.product.resp;

import java.time.Instant;
import java.util.List;

import com.creativePrint.dto.category.CategoryResponse;
import com.creativePrint.dto.design.resp.DesignResponse;

public record ProductResponse(
    Long id,
    String name,
    String description,
    Double basePrice,
    CategoryResponse category,
    DesignResponse design,
    List<com.creativePrint.dto.product.resp.ProductVariantResponse> variants,
    Instant createdAt,
    Instant updatedAt
) {}