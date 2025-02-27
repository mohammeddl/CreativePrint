package com.creativePrint.dto.order.resp;

import com.creativePrint.dto.product.resp.ProductVariantResponse;

public record OrderItemResponse(
    Long id,
    ProductVariantResponse variant,
    Integer quantity
) {}