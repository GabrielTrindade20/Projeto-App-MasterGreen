package com.projeto.mastergreen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.projeto.mastergreen.model.FornecedorGrama;
import com.projeto.mastergreen.service.ServiceFornecedorGrama;

@Controller
@RequestMapping("/fornecedoresgrama")
public class FornecedorGramaController {

	@Autowired
	private ServiceFornecedorGrama fornecedorGramaService;

	public FornecedorGramaController(ServiceFornecedorGrama fornecedorGramaService) {
        this.fornecedorGramaService = fornecedorGramaService;
    }

    @PostMapping("/atualizar")
    public ResponseEntity<?> atualizarFornecedorGrama(@RequestBody FornecedorGrama fornecedorGrama) {
        try {
            FornecedorGrama fornecedorGramaAtualizado = fornecedorGramaService.criarFornecedorGrama(fornecedorGrama);
            return ResponseEntity.ok(fornecedorGramaAtualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar fornecedor de grama.");
        }
    }
}
