package com.creativePrint.service;

import org.springframework.data.domain.Pageable;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

public interface InnerPartnerService {
DesignResponse createDesign(DesignRequest request, User user);
ProductResponse createProduct(ProductRequest request, User user);
// ProductResponse updateProduct(ProductRequest request, User user);
DesignResponse getPartnerDesigns(User partner, Pageable pageable);


    
} 