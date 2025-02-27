package com.creativePrint.dto.design.req;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.*;


public record DesignRequest(
    @NotBlank(message = "Design name is required")
    String name,
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    String description,
    
    @NotNull(message = "Design file is required")
    MultipartFile designFile
) {}