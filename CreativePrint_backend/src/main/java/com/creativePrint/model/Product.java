package com.creativePrint.model;

import java.util.Set;
import java.util.HashSet;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private Double basePrice;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;
    
    @ManyToMany
    @JoinTable(
        name = "product_designs",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "design_id")
    )
    private Set<Design> applicableDesigns = new HashSet<>();
}