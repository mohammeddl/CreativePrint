package com.creativePrint.repository;
import com.creativePrint.model.OrderItem;
import com.creativePrint.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByVariantIn(List<ProductVariant> variants);

    long countByVariantId(Long variantId);
}