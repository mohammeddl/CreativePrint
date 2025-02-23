package com.creativePrint.repository;
import com.creativePrint.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByName(String name);
}