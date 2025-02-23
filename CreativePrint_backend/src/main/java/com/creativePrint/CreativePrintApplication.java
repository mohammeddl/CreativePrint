package com.creativePrint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Creative Print API",
        version = "1.0",
        description = "Creative Print API Documentation"
    )
)
public class CreativePrintApplication {

	public static void main(String[] args) {
		SpringApplication.run(CreativePrintApplication.class, args);
	}

}
