package com.creativePrint.repository;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByDesignCreator(User creator, Pageable pageable);
    @Query("SELECT p FROM Product p WHERE (p.category.id = :categoryId OR p.design.creator.id = :designerId) AND p.id != :productId")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("designerId") Long designerId, @Param("productId") Long productId);
    List<Product> findTop5ByOrderByCreatedAtDesc();
    Optional<Product> findByIdAndDesignCreator(Long productId, User creator);

    Page<Product> findByNameContainingIgnoreCase(String search, Pageable pageable);
    long countByDesignCreator(User creator);

}