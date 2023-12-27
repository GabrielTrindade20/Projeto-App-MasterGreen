package com.projeto.mastergreen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.mastergreen.model.FornecedorGrama;
import com.projeto.mastergreen.service.ServiceFornecedorGrama;

@RestController
@RequestMapping("/fornecedoresgrama")
public class FornecedorGramaController {
    private final ServiceFornecedorGrama serviceFornecedorGrama;
      
    @Autowired
    private ServiceFornecedorGrama ServiceFornecedorGrama;
       
    
    @PostMapping
    public FornecedorGrama criarFornecedorGrama(@RequestBody FornecedorGrama fornecedorGrama) {
        return ServiceFornecedorGrama.criarFornecedorGrama(fornecedorGrama);
    }
    
    @Autowired
    public FornecedorGramaController(ServiceFornecedorGrama serviceFornecedorGrama) {
    	this.serviceFornecedorGrama = serviceFornecedorGrama;
    }


//	@GetMapping("/listar")
//    public ResponseEntity<List<FornecedorGrama>> listarTodosFornecedores() {
//        List<FornecedorGrama> fornecedores = serviceFornecedorGrama.listarTodosOsFornecedores();
//        return ResponseEntity.ok(fornecedores);
//    }
}
