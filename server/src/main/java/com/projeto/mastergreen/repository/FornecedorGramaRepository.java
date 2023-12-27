package com.projeto.mastergreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projeto.mastergreen.model.FornecedorGrama;

@Repository
public interface FornecedorGramaRepository extends JpaRepository<FornecedorGrama, Long> {

    // Método para encontrar um fornecedor pelo ID
    FornecedorGrama findById(long id);

    // Método para encontrar um fornecedor pelo nome
    FornecedorGrama findByNomeFornec(String nome);

    // Método para encontrar todos os fornecedores por tipo
    List<FornecedorGrama> findByTipoGrama(String tipo);

    // Método para encontrar todos os fornecedores com valor acima do especificado
    List<FornecedorGrama> findByValGramaGreaterThan(float valor);

    // Método para encontrar todos os fornecedores com valor abaixo do especificado
    List<FornecedorGrama> findByValGramaLessThan(float valor);

    // Método para encontrar todos os fornecedores com valor entre os valores especificados
    List<FornecedorGrama> findByValGramaBetween(float valor1, float valor2);
}
