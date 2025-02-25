package com.creativePrint.dto.Design.resp;

import java.time.Instant;



public record DesignResponse(
    Long id,
    String name,
    String description,
    String designUrl, 
    Instant createdAt,
    Long partnerId
) {}