package com.creativePrint.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "product_categories")
@Data
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(name = "updated_at")
    private Instant updatedAt;
    @Column(name = "created_at")
    private Instant createdAt;
}