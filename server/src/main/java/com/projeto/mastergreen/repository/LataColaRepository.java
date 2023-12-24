package com.projeto.mastergreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.mastergreen.Enum.Curso;
import com.projeto.mastergreen.Enum.Status;
import com.projeto.mastergreen.model.FornecedorGrama;


public interface LataColaRepository extends CrudRepository<FornecedorGrama, Long>{
	
	@Query("SELECT a FROM Aluno a WHERE a.id=(SELECT MAX(a2.id) FROM Aluno a2)")
	public FornecedorGrama findLastInsertedAluno();

	@Query("SELECT a FROM Aluno a WHERE a.cpf=:cpf")
	public FornecedorGrama findByCpf(String cpf);
	
	@Query("SELECT a FROM Aluno a ORDER BY a.id")
	public List<FornecedorGrama> findAllOrderedById();
	
	@Query("SELECT a FROM Aluno a WHERE a.turno= :turno AND a.curso= :curso AND a.status= :status ORDER BY a.nome")
	public List<FornecedorGrama> findByTurnoAndCursoAndStatus(String turno, Curso curso, Status status);
}
