package com.creativePrint.dto.Design.resp;

import java.time.Instant;
import java.util.List;

public record DesignResponse(
    Long id,
    String name,
    String description,
    Instant createdAt,
    List<String> elementUrls
) {}