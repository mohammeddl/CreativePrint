package com.creativePrint.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "partners")
public class Partner extends User {
    @Column(name = "company_name")
    private String companyName;
    
    @Column(name = "business_type")
    private String businessType;
    
    @Column(name = "tax_id")
    private String taxId;
    
    @Column(name = "commission_rate")
    private Double commissionRate;

    // @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    // private List<Product> products = new ArrayList<>();
}