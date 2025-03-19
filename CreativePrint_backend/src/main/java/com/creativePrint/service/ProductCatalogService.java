package com.creativePrint.service;

import com.creativePrint.dto.Product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductListResponse;
import com.creativePrint.dto.product.resp.ProductListResponse.ProductDTO;

import java.util.List;


public interface ProductCatalogService {

    ProductListResponse getProductCatalog(int page, int size, String category);

    ProductDTO getProductDetails(Long productId);
    ProductDetailWithVariantsDTO getProductDetailsWithVariants(Long productId);
}