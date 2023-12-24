package com.projeto.mastergreen.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.projeto.mastergreen.model.FornecedorGrama;

@Repository
public interface FornecedorGramaRepository extends JpaRepository<FornecedorGrama, Long> {

	@Transactional
	@Modifying
	@Query("UPDATE FornecedorGrama f SET f.nomeFornec = :nome, f.tamanhoGrama = :tamanho, f.tipoGrama = :tipo, f.valGrama = :valor WHERE f.idFornecedor = :id")
	void alterarFornecedorGrama(@Param("id") Long id, @Param("nome") String nome, @Param("tamanho") String tamanho, @Param("tipo") String tipo, @Param("valor") Float valor);

	@Query("SELECT f FROM FornecedorGrama f")
	List<FornecedorGrama> listarTodosOsFornecedores();

}
