package com.creativePrint.model;

import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "product_categories")
@Data
@Builder
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private ProductCategory parentCategory;
}