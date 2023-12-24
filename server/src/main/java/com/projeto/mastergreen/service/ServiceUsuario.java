package com.projeto.mastergreen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.exceptions.CriptoExistsException;
import com.projeto.mastergreen.exceptions.EmailExistsException;
import com.projeto.mastergreen.exceptions.ServiceExc;
import com.projeto.mastergreen.model.Usuario;
import com.projeto.mastergreen.repository.UsuarioRepository;
import com.projeto.mastergreen.util.Util;

@Service
public class ServiceUsuario {

	@Autowired
	UsuarioRepository usuarioRepository; 
	
	public void salvarUsuario(Usuario user) throws Exception{
		try {
			if(usuarioRepository.findByEmail(user.getEmail()) != null)
			{
				
				throw new EmailExistsException("Existe um email cadastrado para :"+
			    user.getEmail());
			}
			user.setSenha(Util.md5(user.getSenha()));
			
		} catch (Exception e) {
			throw new CriptoExistsException("Erro na criptografia da senha!");
		}
		usuarioRepository.save(user);
	}

	public Usuario loginUser(String login, String senha) throws ServiceExc{
		Usuario userLogin= usuarioRepository.buscarLogin(login, senha);
		return userLogin;
}

	
	
	
	
	
}//fim classe
