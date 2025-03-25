package com.creativePrint.repository;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByDesignCreator(User creator, Pageable pageable);
    @Query("SELECT p FROM Product p JOIN p.design d WHERE d.creator = :partner")
    List<Product> findByDesignCreator(@Param("partner") User partner);
    @Query("SELECT p FROM Product p WHERE (p.category.id = :categoryId OR p.design.creator.id = :designerId) AND p.id != :productId")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("designerId") Long designerId, @Param("productId") Long productId);
    List<Product> findTop5ByOrderByCreatedAtDesc();
    Optional<Product> findByIdAndDesignCreator(Long productId, User creator);

    Page<Product> findByNameContainingIgnoreCase(String search, Pageable pageable);
    long countByDesignCreator(User creator);

    @Modifying
    @Query("UPDATE Product p SET p.archived = true WHERE p.id = :productId")
    void archiveProduct(@Param("productId") Long productId);

    @Query("SELECT p FROM Product p WHERE p.archived = false")
    Page<Product> findNonArchivedProducts(Pageable pageable);

    Page<Product> findByCategoryIdAndArchived(Long categoryId, boolean archived, Pageable pageable);
    @Query("SELECT p FROM Product p WHERE p.archived = false AND LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findNonArchivedProductsByName(@Param("search") String search, Pageable pageable);

}