package com.projeto.mastergreen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.model.Turma;
import com.projeto.mastergreen.repository.TurmaRepository;

@Service
public class ServiceTurma {

	@Autowired
	TurmaRepository turmaRepository;
	public String cadastrarTurma(Turma turma) {
		Turma objTurma = turmaRepository.findByCodTurma(turma.getCodTurma());
		if (objTurma != null) {
			return "já existe uma turma com esse código";
		} else {
			return null;
		}
	}
}
