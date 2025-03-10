package com.creativePrint.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.creativePrint.mapper.CategoryMapper;
import com.creativePrint.repository.CategoriesRepository;
import com.creativePrint.service.CategorieService;
import com.creativePrint.dto.category.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategorieServiceImpl implements  CategorieService {
    private final CategoriesRepository categorieRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categorieRepository.findAll().stream()
                .map(category -> categoryMapper.toResponse(category))
                .collect(Collectors.toList());
    }
}