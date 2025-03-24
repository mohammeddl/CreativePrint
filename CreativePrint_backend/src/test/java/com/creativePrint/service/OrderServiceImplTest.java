package com.creativePrint.service;

import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.mapper.OrderItemMapper;
import com.creativePrint.mapper.OrderMapper;
import com.creativePrint.model.Order;
import com.creativePrint.model.User;
import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.service.OrderNotificationService;
import com.creativePrint.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private OrderMapper orderMapper;
    @Mock
    private OrderItemMapper itemMapper;
    @Mock
    private OrderNotificationService notificationService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void createOrder_ValidRequest_ReturnsCreatedOrder() {
        // Arrange
        OrderRequest request = new OrderRequest(1L, List.of());
        User buyer = new User();
        buyer.setId(request.buyerId());
        Order order = new Order();
        OrderResponse expectedResponse = new OrderResponse(1L, null, List.of(), 0.0, OrderStatus.PENDING, null);

        when(userRepository.findById(request.buyerId())).thenReturn(Optional.of(buyer));
        when(orderMapper.toEntity(request)).thenReturn(order);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderMapper.toResponse(order)).thenReturn(expectedResponse);

        // Act
        OrderResponse actualResponse = orderService.createOrder(request);

        // Assert
        assertEquals(expectedResponse.id(), actualResponse.id());
        assertEquals(expectedResponse.status(), actualResponse.status());
    }


}