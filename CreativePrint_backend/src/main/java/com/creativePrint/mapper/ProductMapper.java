package com.creativePrint.mapper;

import java.util.HashSet;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductDesignResponse;
import com.creativePrint.dto.Product.resp.ProductResponse;
import com.creativePrint.dto.Product.resp.ProductVariantResponse;
import com.creativePrint.model.Design;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductCategory;
import com.creativePrint.model.ProductDesign;
import com.creativePrint.model.ProductVariant;

@Mapper(componentModel = "spring", uses = { ProductCategoryMapper.class, DesignMapper.class })
public interface ProductMapper {

    @Mapping(target = "name", source = "request.name")
    @Mapping(target = "description", source = "request.description")
    @Mapping(target = "basePrice", source = "request.basePrice")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "productDesigns", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(ProductRequest request, ProductCategory category);


    // Map Product to ProductResponse
    @Mapping(source = "variants", target = "variants")
    @Mapping(source = "productDesigns", target = "designPlacements")
    ProductResponse toResponse(Product product);

    // Map ProductVariant to ProductVariantResponse
    ProductVariantResponse toVariantResponse(ProductVariant variant);

}