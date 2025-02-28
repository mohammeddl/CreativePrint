package com.creativePrint.controller;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.enums.InteractionType;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final ProductRepository productRepository;

    @GetMapping("/personal")
    public ResponseEntity<List<ProductResponse>> getPersonalizedRecommendations(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(user.getId(), limit));
    }

    @GetMapping("/product/{productId}/similar")
    public ResponseEntity<List<ProductResponse>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(recommendationService.getSimilarProducts(productId, limit));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductResponse>> getTrendingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getTrendingProducts(limit));
    }

    @PostMapping("/track")
    public ResponseEntity<Void> trackInteraction(
            @AuthenticationPrincipal User user,
            @RequestParam Long productId,
            @RequestParam InteractionType type) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        recommendationService.trackInteraction(user, product, type);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/track/search")
    public ResponseEntity<Void> trackSearch(
            @AuthenticationPrincipal User user,
            @RequestParam String query) {
        recommendationService.trackSearch(user, query);
        return ResponseEntity.ok().build();
    }
}