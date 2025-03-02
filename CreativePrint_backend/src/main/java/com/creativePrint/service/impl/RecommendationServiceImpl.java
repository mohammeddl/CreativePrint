package com.creativePrint.service.impl;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.enums.InteractionType;
import com.creativePrint.mapper.ProductMapper;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;
import com.creativePrint.model.UserInteraction;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.repository.UserInteractionRepository;
import com.creativePrint.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {
    private final UserInteractionRepository interactionRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    private static final Map<InteractionType, Integer> INTERACTION_WEIGHTS = Map.of(
            InteractionType.VIEW, 1,
            InteractionType.ADD_TO_CART, 3,
            InteractionType.PURCHASE, 5,
            InteractionType.LIKE, 2
    );

    @Override
    @Transactional
    public void trackInteraction(User user, Product product, InteractionType type) {
        UserInteraction interaction = UserInteraction.builder()
                .user(user)
                .product(product)
                .type(type)
                .weight(INTERACTION_WEIGHTS.getOrDefault(type, 1))
                .timestamp(Instant.now())
                .build();

        interactionRepository.save(interaction);
    }

    @Override
    @Transactional
    public void trackSearch(User user, String searchQuery) {
        UserInteraction interaction = UserInteraction.builder()
                .user(user)
                .type(InteractionType.SEARCH)
                .searchQuery(searchQuery)
                .weight(1)
                .timestamp(Instant.now())
                .build();

        interactionRepository.save(interaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getPersonalizedRecommendations(Long userId, int limit) {
        // Strategy 1: Content-based recommendations
        List<Object[]> userInteractions = interactionRepository.findMostInteractedProductsByUser(userId);

        if (userInteractions.isEmpty()) {
            // Fall back to trending products if user has no interactions
            return getTrendingProducts(limit);
        }

        // Get product IDs that the user has interacted with most
        List<Long> topProductIds = userInteractions.stream()
                .map(row -> (Long) row[0])
                .limit(5)
                .collect(Collectors.toList());

        // Find similar products based on categories and designs
        Set<Long> recommendedProductIds = new HashSet<>();
        for (Long productId : topProductIds) {
            List<Product> similarProducts = findSimilarProducts(productId);
            similarProducts.stream()
                    .map(Product::getId)
                    .forEach(recommendedProductIds::add);

            if (recommendedProductIds.size() >= limit) {
                break;
            }
        }

        // Strategy 2: If not enough recommendations, add collaborative filtering
        if (recommendedProductIds.size() < limit) {
            List<Long> collaborativeIds = interactionRepository.findCollaborativeRecommendations(userId);
            collaborativeIds.stream()
                    .filter(id -> !recommendedProductIds.contains(id))
                    .limit(limit - recommendedProductIds.size())
                    .forEach(recommendedProductIds::add);
        }

        // Get actual product entities and map to DTOs
        return productRepository.findAllById(recommendedProductIds).stream()
                .map(productMapper::toResponse)
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getSimilarProducts(Long productId, int limit) {
        List<Product> similarProducts = findSimilarProducts(productId);
        return similarProducts.stream()
                .filter(p -> !p.getId().equals(productId)) // Exclude the original product
                .map(productMapper::toResponse)
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getTrendingProducts(int limit) {
        // Query to find recently purchased products
        List<Long> trendingProductIds = interactionRepository.findTop10TrendingProducts();

        // Get actual product entities and map to DTOs
        return productRepository.findAllById(trendingProductIds).stream()
                .map(productMapper::toResponse)
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Helper method to find similar products based on category and design attributes
    private List<Product> findSimilarProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        // Find products with the same category or by the same designer
        return productRepository.findSimilarProducts(
                product.getCategory().getId(),
                product.getDesign().getCreator().getId(),
                productId
        );
    }
}