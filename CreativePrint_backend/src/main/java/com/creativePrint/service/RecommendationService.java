package com.creativePrint.service;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.enums.InteractionType;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

import java.util.List;

public interface RecommendationService {
    void trackInteraction(User user, Product product, InteractionType type);
    void trackSearch(User user, String searchQuery);
    List<ProductResponse> getPersonalizedRecommendations(Long userId, int limit);
    List<ProductResponse> getSimilarProducts(Long productId, int limit);
    List<ProductResponse> getTrendingProducts(int limit);
}