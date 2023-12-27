package com.projeto.mastergreen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.exception.CriptoExistsException;
import com.projeto.mastergreen.exception.EmailExistsException;
import com.projeto.mastergreen.model.Usuario;
import com.projeto.mastergreen.repository.UsuarioRepository;
import com.projeto.mastergreen.util.Util;

@Service
public class ServiceUsuario {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public void salvarUsuario(Usuario user) throws Exception {
		try {
			if (usuarioRepository.findByEmail(user.getEmail()) != null) {
				throw new EmailExistsException("Existe um email cadastrado para :" + user.getEmail());
			}
			System.out.println("Senha recebida para criptografia: " + user.getSenha());
			String senhaCriptografada = Util.md5(user.getSenha());
			System.out.println("Senha criptografada: " + senhaCriptografada);
			user.setSenha(senhaCriptografada);
			usuarioRepository.save(user);
		} catch (Exception e) {
			throw new CriptoExistsException("Erro na criptografia da senha!");
		}
	}

	public Usuario loginUser(String email, String senha) throws Exception {
		Usuario userLogin = usuarioRepository.buscarLogin(email, senha);
		return userLogin;
	}

}
// fim da classe
