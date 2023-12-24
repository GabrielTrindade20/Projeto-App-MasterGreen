package com.projeto.senac.service;

import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.senac.model.Aluno;
import com.projeto.senac.repository.AlunoRepository;

@Service
public class ServiceAluno {

	@Autowired
	private AlunoRepository alunoRepository;

	public String gerarMatricula(int id) {
		Date date = new Date();
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int ano = cal.get(Calendar.YEAR);
		String txt = "SENAC";
		return (txt + ano + (id + 1));// SENAC203x
	}// fim gerador de matricula

	public String cadastrarAluno(Aluno aluno) {
		// verifica se existe um aluno com o mesmo cpf
		Aluno alunoExistente = alunoRepository.findByCpf(aluno.getCpf());

		if (alunoExistente == null) {
			Aluno aux = alunoRepository.findLastInsertedAluno();
			if (aux == null) {// primeiro aluno a ser gravado no BD
				aluno.setMatricula(this.gerarMatricula(0));
			} else {// já possui aluno gravado no BD
				aluno.setMatricula(this.gerarMatricula(Integer.parseInt(aux.getId().toString())));
			}

			alunoRepository.save(aluno);
		} // if alunoExistente == null
		else {// existe um aluno já com o mesmo cpf
			return "já existe um aluno cadastrado com esse CPF!";
		}

		return null;
	}

	public String alterarAluno(Aluno aluno, Long id) {
		// verifica se existe um aluno com o mesmo cpf
		Aluno alunoExistente = alunoRepository.findByCpf(aluno.getCpf());

		if ((alunoExistente != null && alunoExistente.getId() == id) || alunoExistente == null) {// primeiro aluno a ser
																									// gravado no BD
			alunoRepository.save(aluno);
		} else {
			return "já existe um aluno cadastrado com esse CPF!";
		}
		// if alunoExistente == null
		return null; // ocorreu tudo bem e foi atualizado na base de dados
	}
}
