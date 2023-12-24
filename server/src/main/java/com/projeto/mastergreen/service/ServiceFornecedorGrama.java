package com.projeto.mastergreen.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.projeto.mastergreen.model.FornecedorGrama;
import com.projeto.mastergreen.repository.FornecedorGramaRepository;

@Service
public class ServiceFornecedorGrama {

	@Autowired
	private FornecedorGramaRepository FornecedorGramaRepository;

	//cria um fornecedor de grama e salva
	@Transactional
    public FornecedorGrama criarFornecedorGrama(FornecedorGrama fornecedorGrama) {
        return FornecedorGramaRepository.save(fornecedorGrama);
    }
	
	//faz a alteraçã o no fornecedor selecionado
	@Transactional
    public FornecedorGrama alterarFornecedorGrama(Long id, String nome, String tamanho, String tipo, Float valor) {
        FornecedorGrama fornecedorGrama = FornecedorGramaRepository.findById(id).orElse(null);
        if (fornecedorGrama != null) {
            fornecedorGrama.setNomeFornec(nome);
            fornecedorGrama.setTamanhoGrama(tamanho);
            fornecedorGrama.setTipoGrama(tipo);
            fornecedorGrama.setValGrama(valor);
            return FornecedorGramaRepository.save(fornecedorGrama);
        }
        return null; // Pode ser útil lidar com o caso em que o fornecedor não é encontrado
    }

	//exclui o fornecedor desejado
    @Transactional
    public void excluirFornecedorGrama(Long id) {
        FornecedorGramaRepository.deleteById(id);
    }

    //lista todos os fornecedores
    public List<FornecedorGrama> listarTodosOsFornecedores() {
        return FornecedorGramaRepository.findAll();
    }
}
