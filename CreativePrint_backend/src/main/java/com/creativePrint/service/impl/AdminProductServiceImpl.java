package com.creativePrint.service.impl;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;
import com.creativePrint.exception.entitesCustomExceptions.DataIntegrityViolationException;
import com.creativePrint.mapper.ProductMapper;
import com.creativePrint.model.Product;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.AdminProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAllProducts(String search, Long categoryId, String status, Pageable pageable) {
        Page<Product> productsPage;

        if (search != null && !search.isEmpty()) {
            productsPage = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else if (categoryId != null) {
            productsPage = productRepository.findByCategoryId(categoryId, pageable);
        } else {
            productsPage = productRepository.findAll(pageable);
        }

        // Convert to response DTOs
        Page<ProductResponse> productResponsePage = productsPage.map(productMapper::toResponse);

        // Create response with pagination info
        Map<String, Object> response = new HashMap<>();
        response.put("content", productResponsePage.getContent());
        response.put("totalPages", productResponsePage.getTotalPages());
        response.put("totalElements", productResponsePage.getTotalElements());
        response.put("number", productResponsePage.getNumber());
        response.put("size", productResponsePage.getSize());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse toggleProductArchiveStatus(Long productId, boolean archived) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Update product archived status
        product.setArchived(archived);
        product = productRepository.save(product);

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        try {
            productRepository.delete(product);
        } catch (Exception e) {

            product.setArchived(true);
            productRepository.save(product);
            throw new DataIntegrityViolationException("Product cannot be deleted due to existing dependencies. Product has been marked as archived instead.");
        }
    }
}