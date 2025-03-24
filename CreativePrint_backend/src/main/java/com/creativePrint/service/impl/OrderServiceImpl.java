package com.creativePrint.service.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderStatusHistoryResponse;
import com.creativePrint.enums.InteractionType;
import com.creativePrint.exception.entitesCustomExceptions.BadRequestException;
import com.creativePrint.model.*;
import com.creativePrint.repository.OrderStatusHistoryRepository;
import com.creativePrint.service.OrderNotificationService;
import com.creativePrint.service.RecommendationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.mapper.OrderItemMapper;
import com.creativePrint.mapper.OrderMapper;
import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.repository.ProductVariantRepository;
import com.creativePrint.service.OrderService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository variantRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper itemMapper;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final OrderNotificationService notificationService;
    private final RecommendationService recommendationService;

    private static final Map<OrderStatus, List<OrderStatus>> ALLOWED_TRANSITIONS = createAllowedTransitionsMap();

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        User buyer = userRepository.findById(request.buyerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Order order = orderMapper.toEntity(request);
        order.setBuyer(buyer);
        order.setStatus(OrderStatus.PENDING); 
        order.setCreatedAt(Instant.now());

        List<OrderItem> items = request.items().stream()
                .map(itemRequest -> {
                    ProductVariant variant = variantRepository.findById(itemRequest.variantId())
                            .orElseThrow(() -> new EntityNotFoundException("Variant not found"));

                    // In POD, we don't check stock - everything is printable

                    // Create order item
                    OrderItem item = itemMapper.toEntity(itemRequest);
                    item.setVariant(variant);
                    item.setOrder(order);
                    return item;
                })
                .toList();

        // Calculate total price
        double total = items.stream()
                .mapToDouble(item -> {
                    Product product = item.getVariant().getProduct();
                    User designer = product.getDesign().getCreator();

                    // Base price + variant adjustment
                    double itemPrice = product.getBasePrice() + item.getVariant().getPriceAdjustment();

                    // Calculate and store royalty information
                    double royaltyPercentage = 0.0;
                    if (designer instanceof Partner) {
                        royaltyPercentage = ((Partner) designer).getCommissionRate();
                    }

                    // Save royalty info to the order item
                    item.setRoyaltyAmount(itemPrice * (royaltyPercentage / 100) * item.getQuantity());

                    return itemPrice * item.getQuantity();
                })
                .sum();

        // Add tax calculation here

        order.setTotalPrice(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        if (savedOrder.getItems() != null) {
            for (OrderItem item : savedOrder.getItems()) {
                Product product = item.getVariant().getProduct();
                recommendationService.trackInteraction(buyer, product, InteractionType.PURCHASE);
            }
        }
        notificationService.notifyOrderCreated(savedOrder);
        return orderMapper.toResponse(savedOrder);
    }


    @Override
    public List<OrderResponse> getOrderHistory(Long userId) {
        return orderRepository.findByBuyerId(userId).stream()
                .map(orderMapper::toResponse)
                .toList();
    }


    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, User updatedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!canUpdateToStatus(order.getStatus(), request.status())) {
            throw new BadRequestException("Cannot update order from " + order.getStatus() + " to " + request.status());
        }

        // Store old status for notification
        OrderStatus oldStatus = order.getStatus();

        // Update order status
        order.setStatus(request.status());
        order.setUpdatedAt(Instant.now());
        Order updatedOrder = orderRepository.save(order);

        // Create status history record
        OrderStatusHistory statusHistory = OrderStatusHistory.builder()
                .order(order)
                .status(request.status())
                .notes(request.notes())
                .updatedBy(updatedBy)
                .createdAt(Instant.now())
                .build();
        statusHistoryRepository.save(statusHistory);

        // Send notification
        notificationService.notifyOrderStatusChange(updatedOrder, oldStatus, request.status(), updatedBy);

        return orderMapper.toResponse(updatedOrder);
    }

    @Override
    public List<OrderStatusHistoryResponse> getOrderStatusHistory(Long orderId) {
        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(orderId);

        return history.stream()
                .map(item -> new OrderStatusHistoryResponse(
                        item.getId(),
                        item.getOrder().getId(),
                        item.getStatus(),
                        item.getNotes(),
                        item.getUpdatedBy() != null ?
                                item.getUpdatedBy().getFirstName() + " " + item.getUpdatedBy().getLastName() :
                                "System",
                        item.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public boolean canUpdateToStatus(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            return true; // Can always set to same status
        }

        List<OrderStatus> allowedNextStatuses = ALLOWED_TRANSITIONS.get(currentStatus);
        return allowedNextStatuses != null && allowedNextStatuses.contains(newStatus);
    }


    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
        return orderMapper.toResponse(order);
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(orderMapper::toResponse);
    }

    @Override
    public Page<OrderResponse> getOrdersByDesignCreator(Long partnerId, Pageable pageable) {
        // This requires a custom repository method - we'll need to add this to OrderRepository
        return orderRepository.findByItemsVariantProductDesignCreatorId(partnerId, pageable)
                .map(orderMapper::toResponse);
    }

    @Override
    public boolean isOrderContainingPartnerDesigns(Long orderId, Long partnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Check if any item in the order contains a design by this partner
        return order.getItems().stream()
                .anyMatch(item -> {
                    Product product = item.getVariant().getProduct();
                    Design design = product.getDesign();
                    return design.getCreator().getId().equals(partnerId);
                });
    }

    private static Map<OrderStatus, List<OrderStatus>> createAllowedTransitionsMap() {
        Map<OrderStatus, List<OrderStatus>> map = new HashMap<>();

        map.put(OrderStatus.PENDING, List.of(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED));
        map.put(OrderStatus.PENDING_PAYMENT, List.of(OrderStatus.PAYMENT_RECEIVED, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED));
        map.put(OrderStatus.PAYMENT_RECEIVED, List.of(OrderStatus.IN_PRODUCTION, OrderStatus.CANCELLED, OrderStatus.REFUNDED));
        map.put(OrderStatus.PAYMENT_FAILED, List.of(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED));
        map.put(OrderStatus.IN_PRODUCTION, List.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.REFUNDED));
        map.put(OrderStatus.SHIPPED, List.of(OrderStatus.DELIVERED, OrderStatus.REFUNDED));
        map.put(OrderStatus.DELIVERED, List.of(OrderStatus.REFUNDED));
        map.put(OrderStatus.CANCELLED, List.of());
        map.put(OrderStatus.REFUNDED, List.of());

        return map;
    }

    public List<OrderResponse> getPartnerOrders(Long partnerId) {
        return orderRepository.findByItemsVariantProductDesignCreatorId(partnerId).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

}
