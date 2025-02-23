package com.creativePrint.dto.Design.req;

import java.util.List;

import jakarta.validation.constraints.*;

public record DesignRequest(
    @NotBlank String name,
    @Size(max = 1000) String description,
    List<String> elementUrls
) {}