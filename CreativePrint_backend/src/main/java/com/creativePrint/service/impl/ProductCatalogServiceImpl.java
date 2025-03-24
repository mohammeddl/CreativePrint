package com.creativePrint.service.impl;

import com.creativePrint.dto.Product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.Product.resp.ProductVariantDTO;
import com.creativePrint.dto.category.CategoryResponse;
//import com.creativePrint.dto.product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductListResponse;
//import com.creativePrint.dto.product.resp.ProductVariantDTO;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;
import com.creativePrint.model.Categories;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductVariant;
import com.creativePrint.repository.CategoriesRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.ProductCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCatalogServiceImpl implements ProductCatalogService {

    private final ProductRepository productRepository;
    private final CategoriesRepository categoriesRepository;

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse getProductCatalog(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Product> productsPage;
        if (category != null && !category.isEmpty()) {
            Categories categoryEntity = categoriesRepository.findByName(category)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + category));
            productsPage = (Page<Product>) productRepository.findByCategoryId(categoryEntity.getId(), pageable)
                    .filter(p -> !p.isArchived());
        } else {
            productsPage = productRepository.findNonArchivedProducts(pageable);
        }

        // Convert entities to DTOs
        List<ProductListResponse.ProductDTO> productDTOs = productsPage.getContent().stream()
                .map(this::enhanceProductDTO)
                .collect(Collectors.toList());

        // Get all unique category names
        List<String> allCategories = categoriesRepository.findAll().stream()
                .map(Categories::getName)
                .collect(Collectors.toList());

        return new ProductListResponse(
                productDTOs,
                productsPage.getTotalPages(),
                productsPage.getTotalElements(),
                page,
                allCategories
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse.ProductDTO getProductDetails(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        return enhanceProductDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailWithVariantsDTO getProductDetailsWithVariants(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        // Convert product variants to DTOs
        List<ProductVariantDTO> variantDTOs = product.getVariants().stream()
                .map(this::mapToVariantDTO)
                .collect(Collectors.toList());

        return new ProductDetailWithVariantsDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getBasePrice(),
                product.getDesign().getDesignUrl(), // Use design image URL
                product.getCategory().getName(),
                isProductHot(product),
                variantDTOs
        );
    }

    private ProductVariantDTO mapToVariantDTO(ProductVariant variant) {
        return new ProductVariantDTO(
                variant.getId(),
                variant.getSize(),
                variant.getColor(),
                variant.getPriceAdjustment(),
                variant.getStock()
        );
    }

    /**
     * Adds additional fields to the basic DTO conversion
     */
    private ProductListResponse.ProductDTO enhanceProductDTO(Product product) {
        ProductListResponse.ProductDTO dto = ProductListResponse.ProductDTO.fromEntity(product);

        // Logic to determine if a product is "hot" - for example, new products or products with high sales
        boolean isHot = isProductHot(product);

        // Create a new DTO with the isHot flag set
        return new ProductListResponse.ProductDTO(
                dto.id(),
                dto.name(),
                dto.description(),
                dto.price(),
                dto.image(),
                dto.category(),
                isHot,
                dto.stock()
        );
    }

    /**
     * Determines if a product should be labeled as "hot"
     */
    private boolean isProductHot(Product product) {
        // This is a placeholder implementation - replace with your business logic
        // For example, products less than 7 days old could be considered "hot"
        return java.time.Duration.between(
                product.getCreatedAt(),
                java.time.Instant.now()
        ).toDays() < 7;
    }
}