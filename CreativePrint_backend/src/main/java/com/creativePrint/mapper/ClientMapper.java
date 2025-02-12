package com.creativePrint.mapper;

import com.creativePrint.dto.req.ClientRegistrationRequest;
import com.creativePrint.dto.resp.ClientResponse;
import com.creativePrint.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "CLIENT")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "designs", ignore = true)
    Client toEntity(ClientRegistrationRequest request);

    ClientResponse toResponse(Client client);
}