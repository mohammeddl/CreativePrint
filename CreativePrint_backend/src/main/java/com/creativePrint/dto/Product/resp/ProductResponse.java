package com.creativePrint.dto.Product.resp;

import java.time.Instant;
import java.util.List;

import com.creativePrint.dto.Category.CategoryResponse;
import com.creativePrint.dto.Design.resp.DesignResponse;

public record ProductResponse(
    Long id,
    String name,
    String description,
    Double basePrice,
    CategoryResponse category,
    DesignResponse design,
    List<ProductVariantResponse> variants,
    Instant createdAt,
    Instant updatedAt
) {}