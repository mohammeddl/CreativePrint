package com.creativePrint.service.impl;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.mapper.OrderItemMapper;
import com.creativePrint.mapper.OrderMapper;
import com.creativePrint.model.Order;
import com.creativePrint.model.OrderItem;
import com.creativePrint.model.ProductVariant;
import com.creativePrint.model.User;
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
                
                // Check stock
                // if (variant.getStock() < itemRequest.quantity()) {
                //     throw new InsufficientStockException("Insufficient stock for variant " + variant.getId());
                // }

                // Update stock
                variant.setStock(variant.getStock() - itemRequest.quantity());
                variantRepository.save(variant);

                // Create order item
                OrderItem item = itemMapper.toEntity(itemRequest);
                item.setVariant(variant);
                item.setOrder(order);
                return item;
            })
            .toList();

        // 4. Calculate total price
        double total = items.stream()
            .mapToDouble(item -> 
                (item.getVariant().getPriceAdjustment() + item.getVariant().getProduct().getBasePrice()) 
                * item.getQuantity()
            )
            .sum();
        order.setTotalPrice(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getOrderHistory(Long userId) {
        return orderRepository.findByBuyerId(userId).stream()
            .map(orderMapper::toResponse)
            .toList();
    }
}
