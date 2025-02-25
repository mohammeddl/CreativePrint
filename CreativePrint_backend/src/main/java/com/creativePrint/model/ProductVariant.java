package com.creativePrint.model;

import java.util.Objects;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;
    private String color;
    private Double priceAdjustment;
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProductVariant that = (ProductVariant) o;

        // If both have IDs, compare by ID
        if (id != null && that.id != null) {
            return Objects.equals(id, that.id);
        }

        return Objects.equals(size, that.size) &&
                Objects.equals(color, that.color) &&
                Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        if (id != null) {
            return Objects.hash(id);
        }
        return Objects.hash(size, color, 
                    (product != null && product.getId() != null) ? product.getId() : 0);
            }
}