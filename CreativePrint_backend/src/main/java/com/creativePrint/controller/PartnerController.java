package com.creativePrint.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;

import com.creativePrint.model.Design;
import com.creativePrint.model.Product;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerProductService partnerProductService;

    @PostMapping("/designs")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<DesignResponse> createDesign(
        @RequestBody @Valid DesignRequest request,
        @AuthenticationPrincipal User partner
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(partnerProductService.createDesign(request, partner));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<ProductResponse> createProduct(
        @RequestBody @Valid ProductRequest request,
        @AuthenticationPrincipal User partner
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(partnerProductService.createProduct(request, partner));
    }

    @GetMapping("/designs")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<Page<DesignResponse>> getDesigns(
        @AuthenticationPrincipal User partner,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(
            partnerProductService.getPartnerDesigns(partner, pageable)
        );
    }
}