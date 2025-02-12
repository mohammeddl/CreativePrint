package com.creativePrint.dto.resp;

public record PartnerResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String companyName,
    String businessType,
    String taxId,
    Double commissionRate,
    boolean active
) {}