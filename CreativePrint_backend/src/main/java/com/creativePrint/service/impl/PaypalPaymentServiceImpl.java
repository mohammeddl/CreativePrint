package com.creativePrint.service.impl;

import com.creativePrint.dto.payment.req.PaypalPaymentRequest;
import com.creativePrint.dto.payment.resp.PaymentResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.enums.PaymentStatus;
import com.creativePrint.exception.entitesCustomExceptions.PaymentException;
import com.creativePrint.model.Order;
import com.creativePrint.model.Payment;
import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.PaymentRepository;
import com.creativePrint.service.PaymentService;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaypalPaymentServiceImpl implements PaymentService {

    private final PayPalHttpClient payPalClient;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${paypal.success-url}")
    private String successUrl;

    @Value("${paypal.cancel-url}")
    private String cancelUrl;

    @Override
    @Transactional
    public PaymentResponse createPaypalPayment(PaypalPaymentRequest request) {
        try {
            // Find the order
            Order order = orderRepository.findById(request.orderId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + request.orderId()));

            // Create PayPal order
            OrdersCreateRequest paypalOrderRequest = new OrdersCreateRequest();
            paypalOrderRequest.prefer("return=representation");
            
            // Set up paypal order
            OrderRequest orderRequest = new OrderRequest();
            orderRequest.checkoutPaymentIntent("CAPTURE");
            
            // Add purchase units
            List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                    .referenceId(order.getId().toString())
                    .description("Order #" + order.getId())
                    .amountWithBreakdown(new AmountWithBreakdown()
                            .currencyCode(request.currency())
                            .value(String.format("%.2f", request.amount())));
            
            purchaseUnits.add(purchaseUnit);
            orderRequest.purchaseUnits(purchaseUnits);
            
            // Set redirect URLs
            ApplicationContext applicationContext = new ApplicationContext()
                    .returnUrl(request.returnUrl() != null ? request.returnUrl() : successUrl)
                    .cancelUrl(request.cancelUrl() != null ? request.cancelUrl() : cancelUrl);
            
            orderRequest.applicationContext(applicationContext);
            
            paypalOrderRequest.requestBody(orderRequest);
            
            // Call PayPal API to create order
            HttpResponse<com.paypal.orders.Order> paypalResponse = payPalClient.execute(paypalOrderRequest);
            com.paypal.orders.Order paypalOrder = paypalResponse.result();
            
            // Find approval URL
            String approvalUrl = paypalOrder.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(LinkDescription::href)
                    .orElseThrow(() -> new PaymentException("No approval URL found in PayPal response"));
            
            // Create and save payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .paymentId(paypalOrder.id())
                    .paypalOrderId(paypalOrder.id())
                    .amount(request.amount())
                    .currency(request.currency())
                    .status(PaymentStatus.PENDING)
                    .paymentMethod("PAYPAL")
                    .createdAt(Instant.now())
                    .build();
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Update order status
            order.setStatus(OrderStatus.PENDING_PAYMENT);
            orderRepository.save(order);
            
            // Return response with approval URL
            return new PaymentResponse(
                    savedPayment.getId(),
                    order.getId(),
                    savedPayment.getPaymentId(),
                    savedPayment.getAmount(),
                    savedPayment.getCurrency(),
                    savedPayment.getStatus(),
                    approvalUrl,
                    savedPayment.getCreatedAt()
            );
            
        } catch (IOException e) {
            log.error("PayPal API error: ", e);
            throw new PaymentException("Error creating PayPal payment: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentResponse executePaypalPayment(String paymentId, String payerId) {
        try {
            // Find payment by PayPal Order ID
            Payment payment = paymentRepository.findByPaypalOrderId(paymentId)
                    .orElseThrow(() -> new EntityNotFoundException("Payment not found with PayPal Order ID: " + paymentId));
            
            Order order = payment.getOrder();
            
            // Create capture request
            OrdersCaptureRequest request = new OrdersCaptureRequest(paymentId);
            request.requestBody(new OrderRequest());
            
            // Call PayPal API to capture payment
            HttpResponse<com.paypal.orders.Order> response = payPalClient.execute(request);
            com.paypal.orders.Order capturedOrder = response.result();
            
            if ("COMPLETED".equals(capturedOrder.status())) {
                // Update payment status
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setPayerEmail(payerId); // Here you would ideally extract more details if available
                payment.setUpdatedAt(Instant.now());
                
                // Update transactions details if available
                if (!capturedOrder.purchaseUnits().isEmpty() && 
                    !capturedOrder.purchaseUnits().get(0).payments().captures().isEmpty()) {
                    payment.setTransactionId(
                        capturedOrder.purchaseUnits().get(0).payments().captures().get(0).id()
                    );
                }
                
                // Update order status
                order.setStatus(OrderStatus.PAYMENT_RECEIVED);
                orderRepository.save(order);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setUpdatedAt(Instant.now());
                
                // Update order status to reflect failed payment
                order.setStatus(OrderStatus.PENDING_PAYMENT);
                orderRepository.save(order);
            }
            
            Payment updatedPayment = paymentRepository.save(payment);
            
            return new PaymentResponse(
                    updatedPayment.getId(),
                    order.getId(),
                    updatedPayment.getPaymentId(),
                    updatedPayment.getAmount(),
                    updatedPayment.getCurrency(),
                    updatedPayment.getStatus(),
                    null,
                    updatedPayment.getCreatedAt()
            );
            
        } catch (IOException e) {
            log.error("PayPal API error during capture: ", e);
            throw new PaymentException("Error capturing PayPal payment: " + e.getMessage());
        }
    }

    @Override
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for order ID: " + orderId));
        
        // No approval URL needed as this is just getting payment info
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPaymentId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                null,
                payment.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public void handlePaymentWebhook(String payload) {
        // This would be a complex implementation that validates and processes 
        // webhook notifications from PayPal
        // For now, we'll log that we received a webhook
        log.info("Received PayPal webhook payload: {}", payload);
        
        // The actual implementation would:
        // 1. Verify the webhook signature
        // 2. Parse the payload
        // 3. Handle various event types (payment.capture.completed, payment.capture.denied, etc.)
        // 4. Update order and payment statuses accordingly
    }
}