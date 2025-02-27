package com.creativePrint.service.impl;

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
import java.util.Set;

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
    
        // Create product (ignore variants from the mapper)
        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setDesign(design);
        product.setCreatedAt(Instant.now());
        product.setUpdatedAt(Instant.now());
        
        // Initialize variants collection
        if (product.getVariants() == null) {
            product.setVariants(new HashSet<>());
        }
    
        // First save the product to get an ID
        Product savedProduct = productRepository.save(product);
        
        // Now create and add variants with the saved product
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
        
        // Set all variants at once
        savedProduct.setVariants(variants);
        
        // Save again to persist the variants
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
    
        // Get a reference to the current variants (important for orphan removal)
        Set<ProductVariant> currentVariants = new HashSet<>(existingProduct.getVariants());
        
        // Remove all current variants
        currentVariants.forEach(variant -> existingProduct.getVariants().remove(variant));
        
        // Create and add new variants
        request.variants().forEach(variantRequest -> {
            ProductVariant variant = ProductVariant.builder()
                    .size(variantRequest.size())
                    .color(variantRequest.color())
                    .priceAdjustment(variantRequest.priceAdjustment())
                    .stock(variantRequest.stock())
                    .product(existingProduct)
                    .build();
            existingProduct.getVariants().add(variant);
        });
        
        // Save updated product
        Product updatedProduct = productRepository.save(existingProduct);
        
        return productMapper.toResponse(updatedProduct);
    }
    @Override
    @Transactional
    public void deleteProduct(Long productId, User partner) {
        // Find existing product
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Check if partner owns the product through the design
        if (!existingProduct.getDesign().getCreator().equals(partner)) {
            throw new AccessDeniedException("You don't own this product");
        }

        // Delete the product
        productRepository.delete(existingProduct);
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
}