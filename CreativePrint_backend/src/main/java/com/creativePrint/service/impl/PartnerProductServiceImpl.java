package com.creativePrint.service.impl;

import com.creativePrint.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import com.creativePrint.dto.design.req.DesignRequest;
import com.creativePrint.dto.design.resp.DesignResponse;
import com.creativePrint.dto.product.req.ProductRequest;
import com.creativePrint.dto.product.req.ProductVariantRequest;
import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.mapper.DesignMapper;
import com.creativePrint.mapper.ProductMapper;
import com.creativePrint.model.Categories;
import com.creativePrint.model.Design;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductVariant;
import com.creativePrint.model.User;
import com.creativePrint.repository.CategoriesRepository;
import com.creativePrint.repository.DesignRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.CloudinaryService;
import com.creativePrint.service.PartnerService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class PartnerProductServiceImpl implements PartnerService {
    private final ProductMapper productMapper;
    private final DesignMapper designMapper;
    private final ProductRepository productRepository;
    private final DesignRepository designRepository;
    private final CategoriesRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public DesignResponse createDesign(DesignRequest request, User partner) throws IOException {
        String designUrl;
        try {
            designUrl = cloudinaryService.uploadFile(
                    request.designFile(),
                    "designs/" + partner.getId());
        } catch (Exception e) {
            throw new IOException("Failed to upload design file", e);
        }

        Design design = designMapper.toEntity(request);
        design.setDesignUrl(designUrl);
        design.setCreator(partner);
        design.setCreatedAt(LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC));
        Design savedDesign = designRepository.save(design);
        return designMapper.toResponse(savedDesign);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, User partner) {
        // Fetch category and design
        Categories category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        Design design = designRepository.findById(request.designId())
                .orElseThrow(() -> new EntityNotFoundException("Design not found"));
        if (!design.getCreator().equals(partner)) {
            throw new AccessDeniedException("You don't own this design");
        }

        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setDesign(design);
        product.setCreatedAt(Instant.now());
        product.setUpdatedAt(Instant.now());
        

        if (product.getVariants() == null) {
            product.setVariants(new HashSet<>());
        }
    

        Product savedProduct = productRepository.save(product);
        

        Set<ProductVariant> variants = new HashSet<>();
        for (ProductVariantRequest variantRequest : request.variants()) {
            ProductVariant variant = ProductVariant.builder()
                    .size(variantRequest.size())
                    .color(variantRequest.color())
                    .priceAdjustment(variantRequest.priceAdjustment())
                    .stock(variantRequest.stock())
                    .product(savedProduct)
                    .build();
            variants.add(variant);
        }

        savedProduct.setVariants(variants);
        

        savedProduct = productRepository.save(savedProduct);
        
        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request, User partner) {
        // Find existing product
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Check if partner owns the product through the design
        if (!existingProduct.getDesign().getCreator().equals(partner)) {
            throw new AccessDeniedException("You don't own this product");
        }

        // Fetch category and design
        Categories category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        Design design = designRepository.findById(request.designId())
                .orElseThrow(() -> new EntityNotFoundException("Design not found"));
        if (!design.getCreator().equals(partner)) {
            throw new AccessDeniedException("You don't own this design");
        }

        // Update product details
        existingProduct.setName(request.name());
        existingProduct.setDescription(request.description());
        existingProduct.setBasePrice(request.basePrice());
        existingProduct.setCategory(category);
        existingProduct.setDesign(design);
        existingProduct.setUpdatedAt(Instant.now());

        Map<String, ProductVariant> existingVariantsMap = existingProduct.getVariants().stream()
                .collect(Collectors.toMap(
                        v -> v.getSize() + "-" + v.getColor(),
                        v -> v,
                        (v1, v2) -> v1
                ));

        // Track which variants to keep
        Set<ProductVariant> variantsToKeep = new HashSet<>();

        // Process new variant requests
        for (ProductVariantRequest variantRequest : request.variants()) {
            String variantKey = variantRequest.size() + "-" + variantRequest.color();

            if (existingVariantsMap.containsKey(variantKey)) {
                // Update existing variant
                ProductVariant existingVariant = existingVariantsMap.get(variantKey);
                existingVariant.setPriceAdjustment(variantRequest.priceAdjustment());
                existingVariant.setStock(variantRequest.stock());
                variantsToKeep.add(existingVariant);
            } else {
                // Create new variant
                ProductVariant newVariant = ProductVariant.builder()
                        .size(variantRequest.size())
                        .color(variantRequest.color())
                        .priceAdjustment(variantRequest.priceAdjustment())
                        .stock(variantRequest.stock())
                        .product(existingProduct)
                        .build();
                variantsToKeep.add(newVariant);
            }
        }

        // Find variants to remove (those in existingVariants but not in variantsToKeep)
        Set<ProductVariant> variantsToRemove = new HashSet<>(existingProduct.getVariants());
        variantsToRemove.removeAll(variantsToKeep);

        // Check if variants to remove are used in orders
        for (ProductVariant variant : variantsToRemove) {
            if (variant.getId() != null) {
                long orderItemCount = orderItemRepository.countByVariantId(variant.getId());
                if (orderItemCount > 0) {
                    // If variant is used in orders, mark it as out of stock instead of removing
                    variant.setStock(0);
                    variantsToKeep.add(variant);
                }
            }
        }

        // Update the product's variants
        existingProduct.getVariants().clear();
        existingProduct.getVariants().addAll(variantsToKeep);

        // Save updated product
        Product updatedProduct = productRepository.save(existingProduct);

        return productMapper.toResponse(updatedProduct);
    }


    @Transactional
    @Override
    public void deleteProduct(Long productId, User partner) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        if (!existingProduct.getDesign().getCreator().equals(partner)) {
            throw new AccessDeniedException("You don't own this product");
        }

        existingProduct.setArchived(true);
        productRepository.save(existingProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DesignResponse> getPartnerDesigns(User partner, Pageable pageable) {
        return designRepository.findByCreator(partner, pageable)
                .map(designMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getPartnerProducts(User partner, Pageable pageable) {
        return productRepository.findByDesignCreator(partner, pageable)
                .map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getPartnerProduct(Long productId, User partner) {
        Product product = productRepository.findByIdAndDesignCreator(productId, partner)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {

            return productRepository.findByNameContainingIgnoreCase(search, pageable)
                    .map(productMapper::toResponse);
        }
        return productRepository.findAll(pageable)
                .map(productMapper::toResponse);
    }
}