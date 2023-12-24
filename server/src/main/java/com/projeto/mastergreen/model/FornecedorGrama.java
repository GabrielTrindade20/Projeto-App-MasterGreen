package com.projeto.mastergreen.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "fornecedorGrama")
@SequenceGenerator(name = "seq_fornecedorGrama", sequenceName = "seq_fornecedorGrama", allocationSize = 1, initialValue = 1)
public class FornecedorGrama implements Serializable {


	private static final long serialVersionUID = 1L;
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "seq_fornecedorGrama")
	private Long id;

	private String nomeFornec;
	private String tamanhoGrama;
	private String tipoGrama;
	private Float valGrama;
	
	public String getNomeFornec() {
		return nomeFornec;
	}


	public void setNomeFornec(String nomeFornec) {
		this.nomeFornec = nomeFornec;
	}


	public String getTamanhoGrama() {
		return tamanhoGrama;
	}


	public void setTamanhoGrama(String tamanhoGrama) {
		this.tamanhoGrama = tamanhoGrama;
	}


	public String getTipoGrama() {
		return tipoGrama;
	}


	public void setTipoGrama(String tipoGrama) {
		this.tipoGrama = tipoGrama;
	}


	public Float getValGrama() {
		return valGrama;
	}


	public void setValGrama(Float valGrama) {
		this.valGrama = valGrama;
	}

	
	
		@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FornecedorGrama other = (FornecedorGrama) obj;
		return Objects.equals(id, other.id);
	}
	
	
	
	
	
	
}
