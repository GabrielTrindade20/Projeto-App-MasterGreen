package com.projeto.mastergreen.service;

import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.model.FornecedorGrama;
import com.projeto.mastergreen.repository.FornecedorGramaRepository;

@Service
public class ServiceFornecedorGrama {
	
	
	private final FornecedorGramaRepository fornecedorGramaRepository;

	@Autowired
	public ServiceFornecedorGrama(FornecedorGramaRepository foneFornecedorGramaRepository) {
		this.fornecedorGramaRepository = foneFornecedorGramaRepository;
	}

	public FornecedorGrama criarFornecedorGrama(FornecedorGrama fornecedorGrama) {
	    System.out.println("Entrou no método criarFornecedorGrama");
	    try {
	        System.out.println("Antes de salvar: " + fornecedorGrama);
	        FornecedorGrama fornecedorGramaSalvo = fornecedorGramaRepository.save(fornecedorGrama);
	        fornecedorGramaRepository.flush(); // Executa a operação imediatamente
	        System.out.println("ID gerado: " + fornecedorGramaSalvo.getId());
	        System.out.println("Após salvar: " + fornecedorGramaSalvo);
	        return fornecedorGramaSalvo;
	    } catch (Exception e) {
	        System.out.println("Erro ao salvar fornecedor de grama: " + e.getMessage());
	        throw e;
	    }
	}



	//faz a alteraçã o no fornecedor selecionado
    public FornecedorGrama alterarFornecedorGrama(Long id, String nome, String tamanho, String tipo, Float valor) {
        FornecedorGrama fornecedorGrama = fornecedorGramaRepository.findById(id).orElse(null);
        if (fornecedorGrama != null) {
            fornecedorGrama.setNomeFornec(nome);
            fornecedorGrama.setTamanhoGrama(tamanho);
            fornecedorGrama.setTipoGrama(tipo);
            fornecedorGrama.setValGrama(valor);
            return fornecedorGramaRepository.save(fornecedorGrama);
        }
        return null;
    }
    
	//exclui o fornecedor desejado
    public void excluirFornecedorGrama(Long id) {
        fornecedorGramaRepository.deleteById(id);
    }

    public List<FornecedorGrama> listarTodosOsFornecedores() {
        return fornecedorGramaRepository.findAll();
    }
}
