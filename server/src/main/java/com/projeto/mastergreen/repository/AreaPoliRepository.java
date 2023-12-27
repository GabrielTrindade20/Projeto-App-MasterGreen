package com.projeto.descoberto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projeto.descoberto.model.AreaPoli;
import com.projeto.descoberto.model.Periodo;


public interface AreaPoliRepository extends JpaRepository<AreaPoli, Long> {
	
	List<AreaPoli> findByPeriodo(Periodo periodo);
	
	@Query("SELECT a FROM AreaPoli a WHERE a.iluminacaoBombas = :iluminacaoBombas")
    List<AreaPoli> findByiluminacaoBombas(@Param("iluminacaoBombas") String iluminacaoBombas);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.aguaDiluicao = :aguaDiluicao")
    List<AreaPoli> findByaguaDiluicao(@Param("aguaDiluicao") String aguaDiluicao);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.vazamentoTubulacoes = :vazamentoTubulacoes")
    List<AreaPoli> findByvazamentoTubulacoes(@Param("vazamentoTubulacoes") String vazamentoTubulacoes);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.limpezaEquipamentos = :limpezaEquipamentos")
    List<AreaPoli> findBylimpezaEquipamentos(@Param("limpezaEquipamentos") String limpezaEquipamentos);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.alimentacaoAgua = :alimentacaoAgua")
    List<AreaPoli> findByalimentacaoAgua(@Param("alimentacaoAgua") String alimentacaoAgua);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.iluminacaoPiso1 = :iluminacaoPiso1")
    List<AreaPoli> findByiluminacaoPiso1(@Param("iluminacaoPiso1") String iluminacaoPiso1);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.iluminacaoPiso2 = :iluminacaoPiso2")
    List<AreaPoli> findByiluminacaoPiso2(@Param("iluminacaoPiso2") String iluminacaoPiso2);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.calhaAplicacao = :calhaAplicacao")
    List<AreaPoli> findByicalhaAplicacao(@Param("calhaAplicacao") String calhaAplicacao);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.calhaDosagemSolucao = :calhaDosagemSolucao")
    List<AreaPoli> findBycalhaDosagemSolucao(@Param("calhaDosagemSolucao") String calhaDosagemSolucao);
    
    @Query("SELECT a FROM AreaPoli a WHERE a.observacao = :observacao")
    List<AreaPoli> findByobservacao(@Param("observacao") String observacao);
}

