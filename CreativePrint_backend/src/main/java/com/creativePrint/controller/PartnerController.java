package com.creativePrint.controller;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;
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
        @AuthenticationPrincipal User partner
    ) throws IOException {
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