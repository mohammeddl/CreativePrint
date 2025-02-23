package com.creativePrint.dto.Product.req;

import java.util.List;

import jakarta.validation.constraints.*;

public record ProductRequest(
    @NotBlank String name,
    @Size(max = 2000) String description,
    @Positive double basePrice,
    @NotNull Long categoryId,
    @NotEmpty List<Long> designIds
) {}