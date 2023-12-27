package com.projeto.mastergreen.model;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.projeto.mastergreen.Enum.Curso;
import com.projeto.mastergreen.Enum.Status;

@Entity
@Table(name = "valorFuncionario")
@SequenceGenerator(name = "seq_valorFuncionario", sequenceName = "seq_valorFuncionario", allocationSize = 1, initialValue = 1)

public class ValorFuncionario implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "seq_aluno")
	private Long id;
	
	private Double valMaoObra; 


	public Double getValMaoObra() {
		return valMaoObra;
	}

	public void setValMaoObra(Double valMaoObra) {
		this.valMaoObra = valMaoObra;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ValorFuncionario other = (ValorFuncionario) obj;
		return Objects.equals(id, other.id);
	}

}
