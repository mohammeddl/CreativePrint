package com.creativePrint.mapper;

import org.mapstruct.Mapper;

import com.creativePrint.dto.category.CategoryResponse;
import com.creativePrint.model.Categories;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Categories category);
}