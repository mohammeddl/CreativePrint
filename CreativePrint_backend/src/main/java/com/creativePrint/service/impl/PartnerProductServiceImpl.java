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
import com.creativePrint.service.CloudinaryService;
import com.creativePrint.service.PartnerService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Set;


import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class PartnerProductServiceImpl implements PartnerService {
    private final ProductMapper productMapper;
    private final DesignMapper designMapper;
    private final ProductRepository productRepository;
    private final DesignRepository designRepository;
    private final ProductCategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public DesignResponse createDesign(DesignRequest request, User partner) throws IOException {
        String designUrl;
        try {
            designUrl = cloudinaryService.uploadFile(
                request.designFile(), 
                "designs/" + partner.getId()
            );
        } catch (Exception e) {
            throw new IOException("Failed to upload design file", e);
        }

        Design design = designMapper.toEntity(request);
        design.setDesignUrl(designUrl);
        design.setCreator(partner);
        
        Design savedDesign = designRepository.save(design);
        return designMapper.toResponse(savedDesign);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, User partner) {
        ProductCategory category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + request.categoryId()));
        
        Set<Design> designs = validateDesignOwnership(request.designIds(), partner);
        
        Product product = productMapper.toEntity(request, category, designs);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DesignResponse> getPartnerDesigns(User partner, Pageable pageable) {
        return designRepository.findByCreator(partner, pageable)
            .map(designMapper::toResponse);
    }

    private Set<Design> validateDesignOwnership(List<Long> designIds, User partner) {
        Set<Design> designs = designRepository.findByIdInAndCreator(designIds, partner);
        if (designs.size() != designIds.size()) {
            List<Long> foundIds = designs.stream().map(Design::getId).toList();
            List<Long> missingIds = designIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
            throw new AccessDeniedException("Invalid design IDs or ownership: " + missingIds);
        }
        return designs;
    }
}
