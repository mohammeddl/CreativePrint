package com.creativePrint.controller;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.creativePrint.dto.design.req.DesignRequest;
import com.creativePrint.dto.design.resp.DesignResponse;
import com.creativePrint.dto.product.req.ProductRequest;
import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.model.User;
import com.creativePrint.service.PartnerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerService partnerProductService;

    @PostMapping("/designs")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<DesignResponse> createDesign(
            @ModelAttribute @Valid DesignRequest request,
            @AuthenticationPrincipal User partner) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partnerProductService.createDesign(request, partner));
    }

    @GetMapping("/designs")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Page<DesignResponse>> getDesigns(
            @AuthenticationPrincipal User partner,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                partnerProductService.getPartnerDesigns(partner, pageable));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody @Valid ProductRequest request,
            @AuthenticationPrincipal User partner) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partnerProductService.createProduct(request, partner));
    }

    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @RequestBody @Valid ProductRequest request,
            @AuthenticationPrincipal User partner) {
        return ResponseEntity.ok(
                partnerProductService.updateProduct(productId, request, partner));
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId,
            @AuthenticationPrincipal User partner) {
        partnerProductService.deleteProduct(productId, partner);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @AuthenticationPrincipal User partner,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                partnerProductService.getPartnerProducts(partner, pageable));
    }

    @GetMapping("/products/{productId}")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<ProductResponse> getProduct(
            @PathVariable Long productId,
            @AuthenticationPrincipal User partner) {
        return ResponseEntity.ok(
                partnerProductService.getPartnerProduct(productId, partner));
    }

    @GetMapping("/products/all")
    @PreAuthorize("hasAnyRole('CLIENT', 'PARTNER')")
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(
                partnerProductService.getAllProducts(pageable, search)
        );
    }

}