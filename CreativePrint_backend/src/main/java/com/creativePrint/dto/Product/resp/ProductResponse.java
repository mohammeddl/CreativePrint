package com.creativePrint.dto.Product.resp;

import java.time.Instant;
import java.util.List;

import com.creativePrint.dto.Category.ProductCategoryResponse;
import com.creativePrint.dto.Design.resp.DesignResponse;

public record ProductResponse(
    Long id,
    String name,
    String description,
    Double basePrice,
    ProductCategoryResponse category,
    List<ProductVariantResponse> variants,
    List<ProductDesignResponse> designPlacements,
    Instant createdAt
) {}