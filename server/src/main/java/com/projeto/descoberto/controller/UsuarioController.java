package com.projeto.descoberto.controller;

import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.projeto.descoberto.exception.CriptoExistsException;
import com.projeto.descoberto.exception.EmailExistsException;
import com.projeto.descoberto.model.Usuario;
import com.projeto.descoberto.repository.UsuarioRepository;
import com.projeto.descoberto.service.ServiceUsuario;
import com.projeto.descoberto.util.Util;

@RestController
@RequestMapping("/api")
//@Controller
public class UsuarioController {

	@Autowired
	private ServiceUsuario serviceUsuario;
	@Autowired
	UsuarioRepository usuarioRepository;

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody Usuario usuario, HttpSession session) throws Exception {
		try {
			Usuario userLogin = serviceUsuario.loginUser(usuario.getEmail(), Util.md5(usuario.getSenha()));
			if (userLogin != null) {
				session.setAttribute("usuarioLogado", userLogin);
				return ResponseEntity.ok(userLogin); // Retorna o usuário autenticado no corpo da resposta
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorreta!");
			}
		} catch (NoSuchAlgorithmException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno do servidor.");
		}
	}

	@GetMapping("/cadastro")
	public ModelAndView cadastro() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("usuario", new Usuario());
		mv.setViewName("Cadastro/cadastro");
		return mv;
	}

	@PostMapping("/salvarUsuario")
	public ModelAndView cadastro(Usuario user) throws Exception{
		ModelAndView mv = new ModelAndView();
		serviceUsuario.salvarUsuario(user);
		mv.setViewName("redirect:/api/cadastro");
		return mv;
	}


}
