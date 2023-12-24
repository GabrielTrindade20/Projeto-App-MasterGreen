package com.projeto.senac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.senac.model.Turma;

public interface TurmaRepository extends CrudRepository<Turma, Long> {
	
	@Query("SELECT t FROM Turma t WHERE t.codTurma = :codTurma")
	public Turma findByCodTurma(String codTurma);
	
	@Query("SELECT t FROM Turma t ORDER BY t.id")
	public List<Turma> findAllOrderedById();
}
 