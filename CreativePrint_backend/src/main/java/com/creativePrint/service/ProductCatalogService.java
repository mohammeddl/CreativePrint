package com.creativePrint.service;

import com.creativePrint.dto.product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductListResponse;
import com.creativePrint.dto.product.resp.ProductListResponse.ProductDTO;
import com.creativePrint.dto.product.resp.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface ProductCatalogService {

    ProductListResponse getProductCatalog(int page, int size, String category);

    ProductDTO getProductDetails(Long productId);
    ProductDetailWithVariantsDTO getProductDetailsWithVariants(Long productId);

}