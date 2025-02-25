package com.creativePrint.mapper;

import org.mapstruct.Mapper;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.model.Design;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DesignMapper {
    @Mapping(target = "createdAt", ignore = true)
    DesignResponse toResponse(Design design);
    
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    Design toEntity(DesignRequest request);
}