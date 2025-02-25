package com.creativePrint.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;

import com.creativePrint.model.Product;


@Mapper(
    componentModel = "spring",
    uses = {CategoryMapper.class, DesignMapper.class, ProductVariantMapper.class}
)
public interface ProductMapper {
    @Mapping(target = "category", ignore = true) 
    @Mapping(target = "design", ignore = true)  
    @Mapping(target = "variants", ignore = true) 
    Product toEntity(ProductRequest request);

    ProductResponse toResponse(Product product);

}