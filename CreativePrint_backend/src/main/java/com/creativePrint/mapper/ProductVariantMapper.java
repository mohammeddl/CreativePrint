package com.creativePrint.mapper;

import com.creativePrint.dto.Product.req.ProductVariantRequest;
import com.creativePrint.dto.Product.resp.ProductVariantResponse;
import com.creativePrint.model.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    ProductVariant toEntity(ProductVariantRequest request);
    ProductVariantResponse toResponse(ProductVariant variant);
}