package com.creativePrint.service;

import com.creativePrint.dto.product.resp.ProductListResponse;
import com.creativePrint.model.Categories;
import com.creativePrint.model.Product;
import com.creativePrint.repository.CategoriesRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.impl.ProductCatalogServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductCatalogServiceImplTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoriesRepository categoriesRepository;

    @InjectMocks
    private ProductCatalogServiceImpl productCatalogService;

    @Test
    void getProductCatalog_ValidCategory_ReturnsFilteredProducts() {
        // Arrange
        String category = "T-Shirts";
        Categories categoryEntity = new Categories();
        categoryEntity.setId(1L);
        categoryEntity.setName(category);
        Product product1 = new Product();
        Product product2 = new Product();
        Page & lt;
        Product > productsPage = new PageImpl & lt;&gt;
        (List.of(product1, product2));

        when(categoriesRepository.findByName(category)).thenReturn(Optional.of(categoryEntity));
        when(productRepository.findByCategoryId(categoryEntity.getId(), any(Pageable.class)))
                .thenReturn(productsPage);

        // Act
        ProductListResponse response = productCatalogService.getProductCatalog(0, 10, category);

        // Assert
        assertEquals(2, response.products().size());
        assertEquals(1, response.totalPages());
        assertEquals(2, response.totalItems());
        assertEquals(0, response.currentPage());
    }

    // Add more test cases...

}