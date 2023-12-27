package com.projeto.descoberto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RestController;
@EntityScan(basePackages = "com.projeto.descoberto.model")
@ComponentScan(basePackages = "com.projeto.descoberto.*")

@EnableJpaRepositories(basePackages = "com.projeto.descoberto.repository")
@EnableTransactionManagement
@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class ProjetoDescobertoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjetoDescobertoApplication.class, args);
	}

}
