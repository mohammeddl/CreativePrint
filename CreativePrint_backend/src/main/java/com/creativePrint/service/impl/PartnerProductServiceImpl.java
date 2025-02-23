package com.creativePrint.service.impl;

import org.springframework.stereotype.Service;

import com.creativePrint.dto.Design.req.DesignRequest;
import com.creativePrint.dto.Design.resp.DesignResponse;
import com.creativePrint.dto.Product.req.ProductRequest;
import com.creativePrint.dto.Product.resp.ProductResponse;
import com.creativePrint.mapper.DesignMapper;
import com.creativePrint.mapper.ProductMapper;
import com.creativePrint.model.Design;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductCategory;
import com.creativePrint.model.User;
import com.creativePrint.repository.DesignRepository;
import com.creativePrint.repository.ProductCategoryRepository;
import com.creativePrint.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;


import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class PartnerProductServiceImpl implements PartnerProductService {
        private final ProductMapper productMapper;
    private final DesignMapper designMapper;
    private final ProductRepository productRepository;
    private final DesignRepository designRepository;
    private final ProductCategoryRepository categoryRepository;

    @Transactional
    public DesignResponse createDesign(DesignRequest request, User creator) {
        Design design = designMapper.toEntity(request);
        design.setCreator(creator);
        design.setElementUrls(request.elementUrls());
        Design savedDesign = designRepository.save(design);
        return designMapper.toResponse(savedDesign);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, User partner) {
        ProductCategory category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Set<Design> designs = designRepository.findByIdInAndCreator(
            request.designIds(), 
            partner
        );

        Product product = productMapper.toEntity(
            request, 
            category, 
            designs
        );
        
        product.setBasePrice(request.basePrice());
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    @Transactional(readOnly = true)
    public Page<DesignResponse> getPartnerDesigns(User partner, Pageable pageable) {
        return designRepository.findByCreator(partner, pageable)
            .map(designMapper::toResponse);
    }
}
