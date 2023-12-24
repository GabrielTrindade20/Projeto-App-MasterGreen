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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import com.projeto.mastergreen.Enum.Curso;
import com.projeto.mastergreen.Enum.Periodo;

@Entity
@SequenceGenerator(name = "seq_turma", sequenceName = "seq_turma", allocationSize = 1, initialValue = 1)
public class Turma implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator="seq_turma")
	private Long id;
	private String codTurma;
	@Enumerated(EnumType.STRING)
	private Curso curso;
	@Enumerated(EnumType.STRING) 
	private Periodo periodo;
	private String turno;
	
	@ManyToMany
	@JoinTable(
			name="turma_aluno", 
			joinColumns= @JoinColumn(name="turma_id"),
			inverseJoinColumns= @JoinColumn(name="aluno_id")
			)
	private List<Aluno> alunos;
	
	@ManyToOne
	@JoinColumn(name="professor_id")
	private Professor professor;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCodTurma() {
		return codTurma;
	}

	public void setCodTurma(String codTurma) {
		this.codTurma = codTurma;
	}

	public Curso getCurso() {
		return curso;
	}

	public void setCurso(Curso curso) {
		this.curso = curso;
	}

	public Periodo getPeriodo() {
		return periodo;
	}

	public void setPeriodo(Periodo periodo) {
		this.periodo = periodo;
	}

	public String getTurno() {
		return turno;
	}

	public void setTurno(String turno) {
		this.turno = turno;
	}

	public List<Aluno> getAlunos() {
		return alunos;
	}

	public void setAlunos(List<Aluno> alunos) {
		this.alunos = alunos;
	}

	public Professor getProfessor() {
		return professor;
	}

	public void setProfessor(Professor professor) {
		this.professor = professor;
	}

	@Override
	public int hashCode() {
		return Objects.hash(alunos, codTurma, curso, id, periodo, professor, turno);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Turma other = (Turma) obj;
		return Objects.equals(alunos, other.alunos) && Objects.equals(codTurma, other.codTurma) && curso == other.curso
				&& Objects.equals(id, other.id) && periodo == other.periodo
				&& Objects.equals(professor, other.professor) && Objects.equals(turno, other.turno);
	}
	
	
	
}
