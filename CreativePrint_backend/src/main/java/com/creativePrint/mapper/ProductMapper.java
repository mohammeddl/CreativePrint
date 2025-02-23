package com.creativePrint.mapper;

import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;
import com.creativePrint.model.Design;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductCategory;

@Mapper(componentModel = "spring", uses = {DesignMapper.class, ProductCategoryMapper.class})
public interface ProductMapper {
    ProductResponse toResponse(Product product);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "category")
    @Mapping(target = "applicableDesigns", source = "designs")
    @Mapping(target = "createdAt", ignore = true)
    Product toEntity(ProductRequest request, ProductCategory category, Set<Design> designs);
}