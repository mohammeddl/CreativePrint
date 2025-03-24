package com.creativePrint.service;

import com.creativePrint.dto.product.resp.ProductResponse;
import com.creativePrint.model.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminProductService {

    Map<String, Object> getAllProducts(String search, Long categoryId, String status, Pageable pageable);

    ProductResponse getProductById(Long productId);

    ProductResponse toggleProductArchiveStatus(Long productId, boolean archived);

    void deleteProduct(Long productId);
}