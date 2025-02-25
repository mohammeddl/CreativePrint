package com.creativePrint.dto.Design.req;

import jakarta.validation.constraints.*;

public record DesignPlacementRequest(
    @NotNull Long designId,
    @NotBlank String placement
) {}
