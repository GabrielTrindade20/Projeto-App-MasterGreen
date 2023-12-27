package com.projeto.descoberto.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.descoberto.model.Usuario;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

	@Query("SELECT i FROM Usuario i WHERE i.email = :email")
	public Usuario findByEmail(String email);

	@Query("SELECT i FROM Usuario i WHERE i.email = :emailU and i.senha= :senhaU")
	public Usuario buscarLogin(String emailU, String senhaU);

	@Query("SELECT i FROM Usuario i WHERE i.email = :email and i.token= :token")
	public Usuario findToken(String email, String token);

}
