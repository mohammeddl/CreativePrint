package com.creativePrint.dto.payment.resp;


import com.creativePrint.enums.PaymentStatus;

import java.time.Instant;

public record PaymentResponse(
    Long id,
    Long orderId,
    String paymentId,
    Double amount,
    String currency,
    PaymentStatus status,
    String approvalUrl,
    Instant createdAt
) {}