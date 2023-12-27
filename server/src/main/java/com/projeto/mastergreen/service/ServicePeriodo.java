package com.projeto.mastergreen.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.model.Periodo;
import com.projeto.mastergreen.model.Usuario;
import com.projeto.mastergreen.repository.PeriodoRepository;

@Service
public class ServicePeriodo {

    @Autowired
    private PeriodoRepository periodoRepository;

    public void criarPeriodo(Periodo periodo) {
        // Implemente a lógica para criar um novo período
        periodoRepository.save(periodo);
    }

    public List<Periodo> buscarPeriodosDoUsuario(Usuario usuario) {
        // Implemente a lógica para buscar períodos de um usuário
        return periodoRepository.findByUsuario(usuario);
    }

    // Outros métodos para atualizar e manipular períodos conforme necessário
}
