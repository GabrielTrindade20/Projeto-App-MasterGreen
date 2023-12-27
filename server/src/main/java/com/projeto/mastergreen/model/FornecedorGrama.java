package com.projeto.mastergreen.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;



@Entity
public class FornecedorGrama {
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
	

	
}
