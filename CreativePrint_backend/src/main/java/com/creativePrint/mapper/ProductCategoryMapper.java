package com.creativePrint.mapper;

import org.mapstruct.Mapper;

import com.creativePrint.dto.Category.ProductCategoryResponse;
import com.creativePrint.model.ProductCategory;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {
    ProductCategoryResponse toResponse(ProductCategory category);
}