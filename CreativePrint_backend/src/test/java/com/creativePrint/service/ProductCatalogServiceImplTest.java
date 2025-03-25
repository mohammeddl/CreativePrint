package com.creativePrint.service;
import com.creativePrint.dto.product.resp.ProductDetailWithVariantsDTO;
import com.creativePrint.dto.product.resp.ProductListResponse;
import com.creativePrint.exception.entitesCustomExceptions.ResourceNotFoundException;
import com.creativePrint.model.Categories;
import com.creativePrint.model.Design;
import com.creativePrint.model.Product;
import com.creativePrint.model.ProductVariant;
import com.creativePrint.repository.CategoriesRepository;
import com.creativePrint.repository.ProductRepository;
import com.creativePrint.service.impl.ProductCatalogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProductCatalogServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoriesRepository categoriesRepository;

    @InjectMocks
    private ProductCatalogServiceImpl productCatalogService;

    private Product testProduct;
    private Categories testCategory;
    private List<Product> productList;
    private Page<Product> productPage;

    @BeforeEach
    void setUp() {
        // Setup test data
        testCategory = Categories.builder()
                .id(1L)
                .name("T-Shirts")
                .build();

        Design testDesign = Design.builder()
                .id(1L)
                .name("Test Design")
                .designUrl("http://example.com/design.jpg")
                .build();

        Set<ProductVariant> variants = new HashSet<>();
        variants.add(ProductVariant.builder()
                .id(1L)
                .size("M")
                .color("Blue")
                .priceAdjustment(5.0)
                .stock(10)
                .build());

        variants.add(ProductVariant.builder()
                .id(2L)
                .size("L")
                .color("Red")
                .priceAdjustment(7.0)
                .stock(15)
                .build());

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("A test product description")
                .basePrice(29.99)
                .category(testCategory)
                .design(testDesign)
                .variants(variants)
                .createdAt(Instant.now().minusSeconds(86400)) //
                .build();


        for (ProductVariant variant : variants) {
            variant.setProduct(testProduct);
        }

        productList = List.of(testProduct);
        productPage = new PageImpl<>(productList);
    }

    @Test
    void getProductCatalog_WithoutCategory_ReturnsAllProducts() {

        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findNonArchivedProducts(any(Pageable.class))).thenReturn(productPage);
        when(categoriesRepository.findAll()).thenReturn(List.of(testCategory));


        ProductListResponse response = productCatalogService.getProductCatalog(0, 10, null);


        assertNotNull(response);
        assertEquals(1, response.products().size());
        assertEquals(1, response.totalItems());
        assertEquals(1, response.totalPages());
        assertEquals(0, response.currentPage());
        assertEquals(1, response.categories().size());
        assertEquals("T-Shirts", response.categories().get(0));
    }

    @Test
    void getProductDetails_ExistingProduct_ReturnsProductDTO() {

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));


        ProductListResponse.ProductDTO result = productCatalogService.getProductDetails(1L);


        assertNotNull(result);
        assertEquals(testProduct.getId(), result.id());
        assertEquals(testProduct.getName(), result.name());
        assertEquals(testProduct.getDescription(), result.description());
        assertEquals(testProduct.getBasePrice(), result.price());
        assertEquals(testProduct.getDesign().getDesignUrl(), result.image());
        assertEquals(testProduct.getCategory().getName(), result.category());
        assertEquals(25, result.stock()); // Sum of variant stocks (10 + 15)
    }

    @Test
    void getProductDetails_NonExistingProduct_ThrowsResourceNotFoundException() {

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productCatalogService.getProductDetails(999L));
    }

    @Test
    void getProductDetailsWithVariants_ReturnsDetailedProduct() {

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductDetailWithVariantsDTO result = productCatalogService.getProductDetailsWithVariants(1L);

        assertNotNull(result);
        assertEquals(testProduct.getId(), result.id());
        assertEquals(testProduct.getName(), result.name());
        assertEquals(testProduct.getDescription(), result.description());
        assertEquals(testProduct.getBasePrice(), result.price());
        assertEquals(testProduct.getDesign().getDesignUrl(), result.image());
        assertEquals(testProduct.getCategory().getName(), result.category());
        assertEquals(2, result.variants().size());

        assertTrue(result.variants().stream().anyMatch(v -> v.size().equals("M") && v.color().equals("Blue")));
        assertTrue(result.variants().stream().anyMatch(v -> v.size().equals("L") && v.color().equals("Red")));
    }
}