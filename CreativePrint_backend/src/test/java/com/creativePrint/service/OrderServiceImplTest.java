package com.creativePrint.service;

import com.creativePrint.dto.order.req.OrderItemRequest;
import com.creativePrint.dto.order.req.OrderRequest;
import com.creativePrint.dto.order.req.OrderStatusUpdateRequest;
import com.creativePrint.dto.order.resp.OrderResponse;
import com.creativePrint.enums.OrderStatus;
import com.creativePrint.mapper.OrderItemMapper;
import com.creativePrint.mapper.OrderMapper;
import com.creativePrint.model.*;
import com.creativePrint.repository.OrderRepository;
import com.creativePrint.repository.OrderStatusHistoryRepository;
import com.creativePrint.repository.ProductVariantRepository;
import com.creativePrint.repository.UserRepository;
import com.creativePrint.service.OrderNotificationService;
import com.creativePrint.service.RecommendationService;
import com.creativePrint.service.impl.OrderNotificationServiceImpl;
import com.creativePrint.service.impl.OrderServiceImpl;
import com.creativePrint.service.impl.RecommendationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductVariantRepository variantRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private OrderItemMapper itemMapper;

    @Mock
    private OrderStatusHistoryRepository statusHistoryRepository;

    @Mock
    private OrderNotificationServiceImpl notificationService;

    @Mock
    private RecommendationServiceImpl recommendationService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User testUser;
    private Product testProduct;
    private ProductVariant testVariant;
    private Order testOrder;
    private OrderRequest orderRequest;
    private OrderResponse orderResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("customer@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();

        Design testDesign = Design.builder()
                .id(1L)
                .name("Test Design")
                .creator(testUser)
                .build();

        Categories testCategory = Categories.builder()
                .id(1L)
                .name("T-Shirts")
                .build();

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .basePrice(29.99)
                .design(testDesign)
                .category(testCategory)
                .build();

        testVariant = ProductVariant.builder()
                .id(1L)
                .product(testProduct)
                .size("M")
                .color("Blue")
                .priceAdjustment(5.0)
                .stock(10)
                .build();

        OrderItemRequest itemRequest = new OrderItemRequest(1L, 2);
        orderRequest = new OrderRequest(1L, List.of(itemRequest));

        OrderItem orderItem = OrderItem.builder()
                .id(1L)
                .variant(testVariant)
                .quantity(2)
                .build();

        testOrder = Order.builder()
                .id(1L)
                .buyer(testUser)
                .items(List.of(orderItem))
                .totalPrice(69.98) // (29.99 + 5.00) * 2
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        orderItem.setOrder(testOrder);


    }

    @Test
    void createOrder_SuccessfullyCreatesOrder() {

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(variantRepository.findById(1L)).thenReturn(Optional.of(testVariant));
        when(orderMapper.toEntity(orderRequest)).thenReturn(testOrder);
        when(itemMapper.toEntity(any(OrderItemRequest.class))).thenReturn(testOrder.getItems().get(0));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(orderMapper.toResponse(testOrder)).thenReturn(mock(OrderResponse.class));


        OrderResponse result = orderService.createOrder(orderRequest);

        assertNotNull(result);
        verify(orderRepository).save(any(Order.class));
        verify(notificationService).notifyOrderCreated(any(Order.class));
        verify(recommendationService).trackInteraction(any(), any(), any());
    }

    @Test
    void getOrderHistory_ReturnsOrdersForUser() {

        List<Order> orders = List.of(testOrder);
        when(orderRepository.findByBuyerId(1L)).thenReturn(orders);
        when(orderMapper.toResponse(any(Order.class))).thenReturn(mock(OrderResponse.class));


        List<OrderResponse> result = orderService.getOrderHistory(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(orderRepository).findByBuyerId(1L);
    }

    @Test
    void updateOrderStatus_SuccessfullyUpdatesStatus() {

        OrderStatusUpdateRequest updateRequest = new OrderStatusUpdateRequest(
                OrderStatus.PENDING_PAYMENT, "Order payment is pending"
        );

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(orderMapper.toResponse(testOrder)).thenReturn(mock(OrderResponse.class));


        OrderResponse result = orderService.updateOrderStatus(1L, updateRequest, testUser);

        assertNotNull(result);
        assertEquals(OrderStatus.PENDING_PAYMENT, testOrder.getStatus());
        verify(statusHistoryRepository).save(any(OrderStatusHistory.class));
        verify(notificationService).notifyOrderStatusChange(
                eq(testOrder),
                eq(OrderStatus.PENDING),
                eq(OrderStatus.PENDING_PAYMENT),
                eq(testUser)
        );
    }

    @Test
    void canUpdateToStatus_ValidatesTransitions() {
        // Test valid transitions
        assertTrue(orderService.canUpdateToStatus(OrderStatus.PENDING, OrderStatus.PENDING_PAYMENT));
        assertTrue(orderService.canUpdateToStatus(OrderStatus.PENDING, OrderStatus.CANCELLED));
        assertTrue(orderService.canUpdateToStatus(OrderStatus.PAYMENT_RECEIVED, OrderStatus.IN_PRODUCTION));

        // Test invalid transitions
        assertFalse(orderService.canUpdateToStatus(OrderStatus.PENDING, OrderStatus.DELIVERED));
        assertFalse(orderService.canUpdateToStatus(OrderStatus.CANCELLED, OrderStatus.PAYMENT_RECEIVED));
        assertFalse(orderService.canUpdateToStatus(OrderStatus.DELIVERED, OrderStatus.SHIPPED));
    }
}