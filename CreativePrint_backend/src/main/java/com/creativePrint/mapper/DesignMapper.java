package com.creativePrint.mapper;

import org.mapstruct.Mapper;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.model.Design;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DesignMapper {
    DesignResponse toResponse(Design design);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Design toEntity(DesignRequest request);
}