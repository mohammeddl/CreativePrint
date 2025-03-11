package com.creativePrint.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.creativePrint.dto.category.CategoryResponse;
import com.creativePrint.model.Categories;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Categories category);

    Object map(Categories category, Class<com.creativePrint.dto.category.CategoryResponse> categoryResponseClass);
}