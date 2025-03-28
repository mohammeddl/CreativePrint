package com.creativePrint.dto.product.resp;

import java.util.List;

public record ProductDetailWithVariantsDTO(
        Long id,
        String name,
        String description,
        Double price,
        String image,
        String category,
        boolean isHot,
        List<ProductVariantDTO> variants
) {}

