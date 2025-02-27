package com.creativePrint.dto.payment.req;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaypalPaymentRequest(
    @NotNull Long orderId,
    @NotNull @Positive Double amount,
    @NotNull String currency,
    String returnUrl,
    String cancelUrl
) {}