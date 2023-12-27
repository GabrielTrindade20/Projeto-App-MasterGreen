package com.projeto.descoberto.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.descoberto.model.Periodo;
import com.projeto.descoberto.model.Usuario;

import java.sql.Date;
import java.util.List;

public interface PeriodoRepository extends CrudRepository<Periodo, Long> {

    // Adicione aqui os métodos de consulta personalizados relacionados a Período, se necessário
    // Exemplo: buscar por usuário e data
    List<Periodo> findByUsuarioAndData(Usuario usuario, Date data);
    List<Periodo> findByUsuario(Usuario usuario);

    // Outros métodos de consulta conforme necessário
}
