package com.projeto.descoberto.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity 
public class AreaPoli {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String iluminacaoBombas;
	private String aguaDiluicao;
	private String vazamentoTubulacoes;
	private String limpezaEquipamentos;
	private String alimentacaoAgua;
	private String iluminacaoPiso1;
	private String iluminacaoPiso2;
	private String calhaAplicacao;
	private String calhaDosagemSolucao;
	private String observacao;

	    
	@ManyToOne
	@JoinColumn(name = "periodo_id") // O nome da coluna de chave estrangeira na tabela AreaPoli
	private Periodo periodo;
	
	public String getObservacao() {
		return observacao;
	}

	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}
	
	public String getIluminacaoBombas() {
		return iluminacaoBombas;
	}

	public void setIluminacaoBombas(String iluminacaoBombas) {
		this.iluminacaoBombas = iluminacaoBombas;
	}

	public String getAguaDiluicao() {
		return aguaDiluicao;
	}

	public void setAguaDiluicao(String aguaDiluicao) {
		this.aguaDiluicao = aguaDiluicao;
	}

	public String getVazamentoTubulacoes() {
		return vazamentoTubulacoes;
	}

	public void setVazamentoTubulacoes(String vazamentoTubulacoes) {
		this.vazamentoTubulacoes = vazamentoTubulacoes;
	}

	public String getLimpezaEquipamentos() {
		return limpezaEquipamentos;
	}

	public void setLimpezaEquipamentos(String limpezaEquipamentos) {
		this.limpezaEquipamentos = limpezaEquipamentos;
	}

	public String getAlimentacaoAgua() {
		return alimentacaoAgua;
	}

	public void setAlimentacaoAgua(String alimentacaoAgua) {
		this.alimentacaoAgua = alimentacaoAgua;
	}

	public String getIluminacaoPiso1() {
		return iluminacaoPiso1;
	}

	public void setIluminacaoPiso1(String iluminacaoPiso1) {
		this.iluminacaoPiso1 = iluminacaoPiso1;
	}

	public String getIluminacaoPiso2() {
		return iluminacaoPiso2;
	}

	public void setIluminacaoPiso2(String iluminacaoPiso2) {
		this.iluminacaoPiso2 = iluminacaoPiso2;
	}

	public String getCalhaAplicacao() {
		return calhaAplicacao;
	}

	public void setCalhaAplicacao(String calhaAplicacao) {
		this.calhaAplicacao = calhaAplicacao;
	}

	public String getCalhaDosagemSolucao() {
		return calhaDosagemSolucao;
	}

	public void setCalhaDosagemSolucao(String calhaDosagemSolucao) {
		this.calhaDosagemSolucao = calhaDosagemSolucao;
	}


}

