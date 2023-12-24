package com.projeto.mastergreen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import com.projeto.mastergreen.Enum.Status;
import com.projeto.mastergreen.model.Aluno;
import com.projeto.mastergreen.model.Professor;
import com.projeto.mastergreen.model.Turma;
import com.projeto.mastergreen.repository.AlunoRepository;
import com.projeto.mastergreen.repository.ProfessorRepository;
import com.projeto.mastergreen.repository.TurmaRepository;
import com.projeto.mastergreen.service.ServiceTurma;

@Controller
public class TurmaController {

	@Autowired
	ProfessorRepository projessorRepository;

	@Autowired
	TurmaRepository turmaRepository;

	@Autowired
	ServiceTurma serviceTurma;

	@Autowired
	AlunoRepository alunoRepository;

	@GetMapping("/carregarTurma")
	public ModelAndView carregarTurma() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("professores", projessorRepository.findAllOrderedById());
		mv.addObject("turma", new Turma());
		mv.setViewName("Turma/turmaInsert");
		return mv;
	}
	
	@GetMapping("/listarTurmas")
	public ModelAndView listarTurmas() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("turmas", turmaRepository.findAllOrderedById());		
		mv.setViewName("Turma/listarTurmas");
		return mv;
	}

	@PostMapping("/inserirTurma")
	public ModelAndView carregarTurma(Turma turma) {
		ModelAndView mv = new ModelAndView();
		String out = serviceTurma.cadastrarTurma(turma);
		
		if(out != null) {
			mv.addObject("professores", projessorRepository.findAllOrderedById());
			mv.addObject("turma", new Turma());
			mv.addObject("msg",out);
			mv.setViewName("Turma/turmaInsert");
		} else {//não existe turma cadastrada, logo posso inserir uma nova turma
			List<Aluno> alunos = alunoRepository.findByTurnoAndCursoAndStatus(turma.getTurno(), 
					turma.getCurso(), Status.ATIVO);
			
			Professor professor= projessorRepository.findById(turma.getProfessor().getId()).get();
			turma.setProfessor(professor);
			mv.addObject("alunos", alunos);
			turma.setAlunos(alunos);
			mv.addObject("turma", turma);
			mv.setViewName("Turma/inserirAlunosTurma");
	}
		return mv;		
	}
	
	@PostMapping("/inserirAlunosTurma")
	public ModelAndView inserirAlunosTurma(Turma turma) {
		ModelAndView mv= new ModelAndView();
		turmaRepository.save(turma);
		mv.setViewName("redirect:/home");
		return mv;
	}
}
