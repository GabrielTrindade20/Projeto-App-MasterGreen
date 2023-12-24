package com.projeto.mastergreen.Enum;

public enum Curso {
	MARKETING("Marketing"), ADMINISTRACAO("Administracao"), ADS("ADS"), CONTABILIDADE("Contabilidade"),
	ENFERMAGEM("Enfermagem");

	private String curso;

	private Curso(String curso) {
		this.curso = curso;
	}

}
