package com.creativePrint.repository;


import com.creativePrint.model.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    List<UserInteraction> findByUserIdOrderByTimestampDesc(Long userId);

    @Query("SELECT ui.product.id, COUNT(ui) as count FROM UserInteraction ui " +
            "WHERE ui.user.id = :userId GROUP BY ui.product.id ORDER BY count DESC")
    List<Object[]> findMostInteractedProductsByUser(@Param("userId") Long userId);

    @Query("SELECT ui1.product.id FROM UserInteraction ui1 " +
            "WHERE ui1.user.id <> :userId AND ui1.product.id IN " +
            "(SELECT DISTINCT ui2.product.id FROM UserInteraction ui2 WHERE ui2.user.id = :userId) " +
            "GROUP BY ui1.product.id ORDER BY COUNT(ui1) DESC")
    List<Long> findCollaborativeRecommendations(@Param("userId") Long userId);

    @Query("SELECT ui.product.id FROM UserInteraction ui WHERE ui.type = 'PURCHASE' " +
            "GROUP BY ui.product.id ORDER BY COUNT(ui) DESC, MAX(ui.timestamp) DESC")
    List<Long> findTop10TrendingProducts();
}