package com.creativePrint.repository;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByDesignCreator(User creator, Pageable pageable);
}