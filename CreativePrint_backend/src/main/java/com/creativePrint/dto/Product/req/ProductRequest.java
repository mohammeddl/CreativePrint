package com.creativePrint.dto.product.req;

import java.util.List;
import java.util.Set;


import jakarta.validation.constraints.*;

public record ProductRequest(
    String name,
    String description,
    Double basePrice,
    Long categoryId, 
    Long designId,  
    List<ProductVariantRequest> variants
) {}