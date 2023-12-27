package com.projeto.mastergreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.projeto.mastergreen.Enum.Curso;
import com.projeto.mastergreen.Enum.Status;
import com.projeto.mastergreen.model.FornecedorGrama;


public interface LataColaRepository extends CrudRepository<FornecedorGrama, Long>{

}
