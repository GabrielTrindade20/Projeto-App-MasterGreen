package com.projeto.descoberto.controller;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.descoberto.model.Periodo;
import com.projeto.descoberto.model.Usuario;
import com.projeto.descoberto.repository.UsuarioRepository;
import com.projeto.descoberto.service.ServicePeriodo;

@RequestMapping("/api/periodo")
@RestController
public class PeriodoController {
    @Autowired
    private ServicePeriodo servicePeriodo;

    @Autowired
    private UsuarioRepository usuarioRepository; // Importe o repositório de Usuário

    @PostMapping
    public ResponseEntity<?> criarPeriodo(@Valid @RequestBody Periodo periodo, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

        if (usuarioLogado != null) {
            // Associe o usuário logado ao período
            periodo.setUsuario(usuarioLogado);
            servicePeriodo.criarPeriodo(periodo);
            return ResponseEntity.ok("Período criado com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não logado.");
        }
    }
}
