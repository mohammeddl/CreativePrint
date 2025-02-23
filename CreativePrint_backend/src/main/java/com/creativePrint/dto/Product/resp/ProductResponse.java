package com.creativePrint.dto.Product.resp;

import java.time.Instant;
import java.util.List;

import com.creativePrint.dto.Category.ProductCategoryResponse;
import com.creativePrint.dto.Design.resp.DesignResponse;

public record ProductResponse(
    Long id,
    String name,
    String description,
    double basePrice,
    ProductCategoryResponse category,
    List<DesignResponse> applicableDesigns,
    Instant createdAt
) {}