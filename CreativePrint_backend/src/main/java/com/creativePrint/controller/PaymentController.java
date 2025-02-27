package com.creativePrint.controller;

import com.creativePrint.dto.payment.req.PaypalPaymentRequest;
import com.creativePrint.dto.payment.resp.PaymentResponse;
import com.creativePrint.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/paypal/create")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<PaymentResponse> createPaypalPayment(
            @Valid @RequestBody PaypalPaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPaypalPayment(request));
    }

    @GetMapping("/paypal/execute")
    public ResponseEntity<PaymentResponse> executePaypalPayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {
        return ResponseEntity.ok(paymentService.executePaypalPayment(paymentId, payerId));
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @PostMapping("/paypal/webhook")
    public ResponseEntity<Void> handlePaypalWebhook(
            @RequestBody String payload) {
        paymentService.handlePaymentWebhook(payload);
        return ResponseEntity.ok().build();
    }
}