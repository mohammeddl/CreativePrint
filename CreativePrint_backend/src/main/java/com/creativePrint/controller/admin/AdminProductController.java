package com.creativePrint.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.service.AdminProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {

        Map<String, Object> response = adminProductService.getAllProducts(search, categoryId, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productId) {
        ProductResponse product = adminProductService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{productId}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> toggleProductArchiveStatus(
            @PathVariable Long productId,
            @RequestBody Map<String, Boolean> archiveUpdate) {

        boolean archived = archiveUpdate.get("archived");
        ProductResponse product = adminProductService.toggleProductArchiveStatus(productId, archived);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        adminProductService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}