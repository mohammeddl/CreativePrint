package com.creativePrint.dto.resp;

public record ClientResponse(
    Long id,
    String firstName,
    String lastName,
    String email,
    String shippingAddress,
    String billingAddress,
    String phoneNumber,
    boolean active
) {}