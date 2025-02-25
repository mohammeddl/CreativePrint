package com.creativePrint.mapper;

import com.creativePrint.dto.req.PartnerRegistrationRequest;
import com.creativePrint.dto.resp.PartnerResponse;
import com.creativePrint.model.Partner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PartnerMapper {
    PartnerMapper INSTANCE = Mappers.getMapper(PartnerMapper.class);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Partner toEntity(PartnerRegistrationRequest request);

    PartnerResponse toResponse(Partner partner);
}
