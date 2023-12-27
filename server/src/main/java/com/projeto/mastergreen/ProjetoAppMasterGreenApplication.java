package com.projeto.mastergreen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RestController;

@EntityScan(basePackages = "com.projeto.mastergreen.*")
@ComponentScan(basePackages = "com.projeto.mastergreen.*")
@EnableJpaRepositories(basePackages = "com.projeto.mastergreen.repository")
@EnableTransactionManagement
@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class ProjetoAppMasterGreenApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjetoAppMasterGreenApplication.class, args);
	}
	
	


}
