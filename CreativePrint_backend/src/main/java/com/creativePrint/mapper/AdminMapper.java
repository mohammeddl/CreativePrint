package com.creativePrint.mapper;

import com.creativePrint.dto.req.AdminRegistrationRequest;
import com.creativePrint.dto.resp.AdminResponse;
import com.creativePrint.model.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "ADMIN")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Admin toEntity(AdminRegistrationRequest request);

    AdminResponse toResponse(Admin admin);
}
