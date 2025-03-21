package com.creativePrint.mapper;

import org.mapstruct.Mapper;

import com.creativePrint.dto.design.req.DesignRequest;
import com.creativePrint.dto.design.resp.DesignResponse;
import com.creativePrint.model.Design;

@Mapper(componentModel = "spring")
public interface DesignMapper {
    Design toEntity(DesignRequest request);
    DesignResponse toResponse(Design design);
}