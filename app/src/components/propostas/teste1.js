import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const PropostaForm = ({ onAdicionarProduto }) => {
    const [dados, setDados] = useState({
        cliente: '',
        ac: '',
        telefone: '',
        endereco: '',
        cnpj: '',
        dataProposta: '',
    });

    const [novoProduto, setNovoProduto] = useState({
        quantidade: 0,
        descricao: '',
        valorUnitario: 0.0,
    });

    const handleAdicionarProduto = () => {
        onAdicionarProduto({
            ...dados,
            produtos: [novoProduto, ...produtos], // Adiciona o novo produto à lista existente
        });
        // Limpa os campos do novo produto
        setNovoProduto({ quantidade: 0, descricao: '', valorUnitario: 0.0 });
    };

    return (
        <View>
            {/* Componentes TextInput para coletar os dados do usuário */}
            <TextInput
                placeholder="Cliente"
                value={dados.cliente}
                onChangeText={(text) => setDados({ ...dados, cliente: text })}
            />
            <TextInput
                placeholder="A/C"
                value={dados.ac}
                onChangeText={(text) => setDados({ ...dados, ac: text })}
            />
            <TextInput
                placeholder="Telefone"
                value={dados.telefone}
                onChangeText={(text) => setDados({ ...dados, telefone: text })}
            />
            <TextInput
                placeholder="Endereço"
                value={dados.endereco}
                onChangeText={(text) => setDados({ ...dados, endereco: text })}
            />
            <TextInput
                placeholder="cnpj"
                value={dados.cnpj}
                onChangeText={(text) => setDados({ ...dados, cnpj: text })}
            />
            {/* Adicione outros campos conforme necessário */}
            <TextInput
                placeholder="Data da proposta"
                value={dados.dataProposta}
                onChangeText={(text) => setDados({ ...dados, dataProposta: text })}
            />
            {/* Adicione outros campos conforme necessário */}

            {/* Componentes TextInput para coletar os dados do novo produto */}
            <TextInput
                placeholder="Quantidade"
                value={novoProduto.quantidade.toString()}
                onChangeText={(text) => setNovoProduto({ ...novoProduto, quantidade: parseInt(text) })}
                keyboardType="numeric"
            />
            {/* Adicione outros campos conforme necessário */}

            {/* Botão para adicionar o produto */}
            <Button title="Adicionar Produto" onPress={handleAdicionarProduto} />
        </View>
    );
};

export default PropostaForm;
