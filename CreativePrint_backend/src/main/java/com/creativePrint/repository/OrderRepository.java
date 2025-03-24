package com.creativePrint.repository;
import java.util.List;
import com.creativePrint.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.items i " +
            "JOIN i.variant v " +
            "JOIN v.product p " +
            "JOIN p.design d " +
            "WHERE d.creator.id = :partnerId")
    Page<Order> findByItemsVariantProductDesignCreatorId(
            @Param("partnerId") Long partnerId,
            Pageable pageable
    );
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i JOIN i.variant v JOIN v.product p JOIN p.design d WHERE d.creator.id = :partnerId")
    List<Order> findByItemsVariantProductDesignCreatorId(@Param("partnerId") Long partnerId);

}