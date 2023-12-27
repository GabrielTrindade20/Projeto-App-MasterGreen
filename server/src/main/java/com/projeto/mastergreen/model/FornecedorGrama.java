package com.projeto.mastergreen.model;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "fornecedorGrama")
public class FornecedorGrama {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

	public Long getId() {
        return id;
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
