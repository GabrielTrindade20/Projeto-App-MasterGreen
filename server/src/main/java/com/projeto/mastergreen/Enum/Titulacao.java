package com.projeto.mastergreen.Enum;

public enum Titulacao {
POS("POS"), MESTRADO("MESTRADO"), DOUTORADO("DOUTORADO"), POSDOC("POSDOC");
	
	private String titulo;
	private Titulacao(String titulo) {
		this.titulo=titulo;
	}
}
