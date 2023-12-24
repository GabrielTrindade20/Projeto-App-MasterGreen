package com.projeto.mastergreen.model;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "lataCola")
@SequenceGenerator(name = "seq_lataCola", sequenceName = "seq_lataCola", allocationSize = 1, initialValue = 1)
public class LataCola implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	// @GeneratedValue(strategy = GenerationType.IDENTITY, generator="seq_aluno")
	private Long id;

	private String nomeFornec;
	private Double valLataCola;
	

	public String getNomeFornec() {
		return nomeFornec;
	}


	public void setNomeFornec(String nomeFornec) {
		this.nomeFornec = nomeFornec;
	}



	public Double getValLataCola() {
		return valLataCola;
	}



	public void setValLataCola(Double valLataCola) {
		this.valLataCola = valLataCola;
	}



	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		LataCola other = (LataCola) obj;
		return Objects.equals(id, other.id);
	}

}
