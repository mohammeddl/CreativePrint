package com.creativePrint.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.creativePrint.dto.order.req.OrderItemRequest;
import com.creativePrint.dto.order.resp.OrderItemResponse;
import com.creativePrint.model.OrderItem;
import com.creativePrint.model.ProductVariant;

@Mapper(componentModel = "spring", uses = {ProductVariantMapper.class, DesignMapper.class})
public interface OrderItemMapper {
    @Mapping(target = "variant", source = "variantId", qualifiedByName = "idToVariant")
    OrderItem toEntity(OrderItemRequest request);

    @Mapping(target = "design", source = "variant.product.design")
    @Mapping(target = "productName", source = "variant.product.name")
    OrderItemResponse toResponse(OrderItem item);

    @Named("idToVariant")
    default ProductVariant idToVariant(Long id) {
        return ProductVariant.builder().id(id).build();
    }
}