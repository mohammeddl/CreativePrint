package com.creativePrint.dto.order.resp;

import com.creativePrint.dto.design.resp.DesignResponse;
import com.creativePrint.dto.product.resp.ProductVariantResponse;

public record OrderItemResponse(
        Long id,
        ProductVariantResponse variant,
        Integer quantity,
        DesignResponse design,
        String productName
) {}