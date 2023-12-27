package com.projeto.mastergreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projeto.mastergreen.model.FornecedorGrama;

public interface FornecedorGramaRepository extends JpaRepository<FornecedorGrama, Long> {


    // Método para encontrar um fornecedor pelo nome
    List<FornecedorGrama> findByNomeFornec(String nome);

    // Método para encontrar todos os fornecedores por tipo
    List<FornecedorGrama> findByTipoGrama(String tipo);

    @Query("SELECT a FROM FornecedorGrama a WHERE a.nomeFornec = :nomeFornec")
    List<FornecedorGrama> findBynomeFornec(@Param("nomeFornec") String nomeFornec);
    

    @Query("SELECT a FROM FornecedorGrama a WHERE a.tipoGrama = :tipoGrama")
    List<FornecedorGrama> findBytipoGrama(@Param("tipoGrama") String tipoGrama);
    
    
    @Query("SELECT a FROM FornecedorGrama a WHERE a.valGrama = :valGrama")
    List<FornecedorGrama> findByvalGrama(@Param("valGrama") String valGrama);

}
