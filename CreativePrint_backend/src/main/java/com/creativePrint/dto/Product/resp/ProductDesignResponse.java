package com.creativePrint.dto.Product.resp;

import com.creativePrint.dto.Design.resp.DesignResponse;
import com.fasterxml.jackson.annotation.JsonIgnore;

public record ProductDesignResponse(
    Long id,
    @JsonIgnore 
    DesignResponse design,
    String placement
) {}