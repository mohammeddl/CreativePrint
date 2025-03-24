package com.creativePrint.controller.admin;



import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.creativePrint.repository.ProductRepository;
import com.creativePrint.model.Product;
import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.mapper.ProductMapper;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<Product> productsPage;

        // Apply filters if provided
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

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        return ResponseEntity.ok(productMapper.toResponse(product));
    }

    @PatchMapping("/{productId}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> toggleProductArchiveStatus(
            @PathVariable Long productId,
            @RequestBody Map<String, Boolean> archiveUpdate) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Update product archived status
        boolean archived = archiveUpdate.get("archived");
        // Assuming you have an 'archived' field in your Product entity
        // If not, you'll need to add this field or use another approach
        product.setArchived(archived);
        product = productRepository.save(product);

        return ResponseEntity.ok(productMapper.toResponse(product));
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));


        product.setArchived(true);
        productRepository.save(product);

        return ResponseEntity.noContent().build();
    }
}