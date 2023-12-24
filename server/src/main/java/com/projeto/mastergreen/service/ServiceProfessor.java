package com.projeto.mastergreen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.model.Professor;
import com.projeto.mastergreen.repository.ProfessorRepository;

@Service
public class ServiceProfessor {

	@Autowired
	ProfessorRepository professorRepository;
	
	public String cadastrarProfessor(Professor professor) {
		
		Professor profExiste= professorRepository.findByCpf(professor.getCpf());
		
		if(profExiste != null) {
			return "Já Existe um Professor cadastrado com o mesmo cpf!";
		}
		else {
			professorRepository.save(professor);
		}
		
		return null;
	}
	
	public String alterarProfessor(Professor professor, long id) {
		
		Professor professorExistente = professorRepository.findByCpf(professor.getCpf());
		if((professorExistente != null && professorExistente.getId() == id) || professorExistente == null) {
			professorRepository.save(professor);
		}
		
		else {
			return "Já existe um professor com o mesmo cpf!";
		}
		
		return null;
	}
	
}
