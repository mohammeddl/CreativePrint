package com.creativePrint.service;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;
import com.creativePrint.model.Product;
import com.creativePrint.model.User;

public interface PartnerService {
    DesignResponse createDesign(DesignRequest request, User partner) throws IOException;
    ProductResponse createProduct(ProductRequest request, User partner);
    Page<DesignResponse> getPartnerDesigns(User partner, Pageable pageable);


    
} 