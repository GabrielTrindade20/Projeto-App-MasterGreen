package com.projeto.mastergreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.mastergreen.model.Professor;


public interface ProfessorRepository extends CrudRepository<Professor, Long>{

	@Query("SELECT p FROM Professor p WHERE p.cpf=:cpf")
	public Professor findByCpf(String cpf);
	
	@Query("SELECT p FROM Professor p ORDER BY p.id")
	public List<Professor> findAllOrderedById();
	
	
}
