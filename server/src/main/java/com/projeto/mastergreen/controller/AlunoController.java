  package com.projeto.mastergreen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import com.projeto.mastergreen.model.Aluno;
import com.projeto.mastergreen.repository.AlunoRepository;
import com.projeto.mastergreen.service.ServiceAluno;

@Controller
public class AlunoController {

	@Autowired
	ServiceAluno serviceAluno;

	@Autowired
	AlunoRepository alunoRepository;

	@GetMapping("/inserirAluno")
	public ModelAndView insertAluno() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("aluno", new Aluno());
		mv.setViewName("Aluno/inserirAluno");
		return mv;
	}
	
	@GetMapping("/listarAlunos")
	public ModelAndView listarAlunos() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("alunos", alunoRepository.findAllOrderedById());
		mv.setViewName("Aluno/listarAlunos");
		return mv;
	}
	
	@GetMapping("/listarAlterarAlunos")
	public ModelAndView listarAlterarAlunos() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("alunos", alunoRepository.findAllOrderedById());
		mv.setViewName("Aluno/listarAlterar");
		return mv;
	}
	
	@GetMapping("/listarExcluirAluno")
	public ModelAndView listarExcluirAlunos() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("alunos", alunoRepository.findAllOrderedById());
		mv.setViewName("Aluno/listarExcluir");
		return mv;
	}
	
	@PostMapping("/alterar")
	public ModelAndView alterarAluno(Aluno aluno) {
		ModelAndView mv = new ModelAndView();
		String out = serviceAluno.alterarAluno(aluno, aluno.getId());

		if (out != null) {// ocurreu tudo bem
			mv.addObject("msg", out);
			mv.addObject("aluno", aluno);
			mv.setViewName("Aluno/alterar");
		} else {
			mv.setViewName("redirect:/listarAlunos");
		}
		return mv;
	}

	

	@GetMapping("/alterar/{id}")
	public ModelAndView getAlterar(@PathVariable("id") Long id) {
		ModelAndView mv = new ModelAndView();
		Aluno aluno = alunoRepository.findById(id).get();
		mv.addObject("aluno", aluno);
		mv.setViewName("Aluno/alterar");
		return mv;
	}

	@PostMapping("/inserirAluno")
	public ModelAndView inserir(Aluno aluno) {
		ModelAndView mv = new ModelAndView();

		String out = serviceAluno.cadastrarAluno(aluno);

		if (out != null) {// existe aluno com o mesmo cpf
			mv.addObject("aluno", new Aluno());
			mv.addObject("msg", out);
			mv.setViewName("Aluno/inserirALuno");
		} else {
			mv.setViewName("redirect:/listarAlunos");
		}

		return mv;
	}

	@GetMapping("/excluir/{id}")
	public String excluir(@PathVariable("id") Long id) {
		alunoRepository.deleteById(id);
		return "redirect:/listarAlunos";
	}

	

}
