package com.creativePrint.dto.product.resp;

import java.util.List;

public record ProductListResponse(
        List<ProductDTO> products,
        int totalPages,
        long totalItems,
        int currentPage,
        List<String> categories
) {

    public record ProductDTO(
            Long id,
            String name,
            String description,
            Double price,
            String image,
            String category,
            boolean isHot,
            int stock
    ) {
        // Static factory method to create from a Product entity
        public static ProductDTO fromEntity(com.creativePrint.model.Product product) {
            return new ProductDTO(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getBasePrice(), // Base price becomes the display price
                    product.getDesign().getDesignUrl(), // Use design image URL
                    product.getCategory().getName(),
                    false, // Default not hot, can be set by service
                    calculateTotalStock(product)
            );
        }

        // Calculate total stock from all variants
        private static int calculateTotalStock(com.creativePrint.model.Product product) {
            return product.getVariants().stream()
                    .mapToInt(variant -> variant.getStock())
                    .sum();
        }
    }
}