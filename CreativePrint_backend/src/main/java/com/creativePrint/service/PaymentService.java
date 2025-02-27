package com.creativePrint.service;

import com.creativePrint.dto.payment.req.PaypalPaymentRequest;
import com.creativePrint.dto.payment.resp.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPaypalPayment(PaypalPaymentRequest request);
    PaymentResponse executePaypalPayment(String paymentId, String payerId);
    PaymentResponse getPaymentByOrderId(Long orderId);
    void handlePaymentWebhook(String payload);
}