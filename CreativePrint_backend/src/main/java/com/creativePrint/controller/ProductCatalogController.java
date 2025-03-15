package com.creativePrint.controller;

import com.creativePrint.dto.product.resp.ProductListResponse;
import com.creativePrint.service.ProductCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "Public API for browsing products")
public class ProductCatalogController {
    private final ProductCatalogService productCatalogService;

    @GetMapping
    @Operation(summary = "Get product catalog with pagination and optional filtering")
    public ResponseEntity<ProductListResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(productCatalogService.getProductCatalog(page, size, category));
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get detailed product information by ID")
    public ResponseEntity<ProductListResponse.ProductDTO> getProductDetails(@PathVariable Long productId) {
        return ResponseEntity.ok(productCatalogService.getProductDetails(productId));
    }
}