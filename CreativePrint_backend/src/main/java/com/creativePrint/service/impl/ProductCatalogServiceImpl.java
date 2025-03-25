package com.creativePrint.service.impl;

import com.creativePrint.dto.product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.dto.product.resp.ProductVariantDTO;
//import com.creativePrint.dto.product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductListResponse;
//import com.creativePrint.dto.product.resp.ProductVariantDTO;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;
import com.creativePrint.mapper.ProductMapper;
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
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public ProductListResponse getProductCatalog(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Product> productsPage;
        if (category != null && !category.isEmpty()) {
            Categories categoryEntity = categoriesRepository.findByName(category)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + category));
            productsPage = productRepository.findByCategoryIdAndArchived(
                    categoryEntity.getId(),
                    false,
                    pageable
            );
        } else {
            productsPage = productRepository.findNonArchivedProducts(pageable);
        }

        List<ProductListResponse.ProductDTO> productDTOs = productsPage.getContent().stream()
                .map(this::enhanceProductDTO)
                .collect(Collectors.toList());

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

        List<ProductVariantDTO> variantDTOs = product.getVariants().stream()
                .map(this::mapToVariantDTO)
                .collect(Collectors.toList());

        return new ProductDetailWithVariantsDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getBasePrice(),
                product.getDesign().getDesignUrl(),
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

    private ProductListResponse.ProductDTO enhanceProductDTO(Product product) {
        ProductListResponse.ProductDTO dto = ProductListResponse.ProductDTO.fromEntity(product);

        boolean isHot = isProductHot(product);

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

    private boolean isProductHot(Product product) {
        return java.time.Duration.between(
                product.getCreatedAt(),
                java.time.Instant.now()
        ).toDays() < 7;
    }


}