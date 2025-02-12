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
@Table(name = "clients")
public class Client extends User {
    @Column(name = "shipping_address")
    private String shippingAddress;
    
    @Column(name = "billing_address")
    private String billingAddress;
    
    @Column(name = "phone_number")
    private String phoneNumber;

    // @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    // private List<Order> orders = new ArrayList<>();

    // @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    // private List<Design> designs = new ArrayList<>();
}