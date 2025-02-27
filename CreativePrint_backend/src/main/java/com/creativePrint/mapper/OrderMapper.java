package com.creativePrint.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.model.Order;
import com.creativePrint.model.User;

@Mapper(componentModel = "spring", uses = {UserMapper.class, OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "buyer", source = "buyerId", qualifiedByName = "idToUser")
    @Mapping(target = "items", source = "items")
    Order toEntity(OrderRequest request);

    OrderResponse toResponse(Order order);

    @Named("idToUser")
    default User idToUser(Long id) {
        return User.builder().id(id).build();
    }
}