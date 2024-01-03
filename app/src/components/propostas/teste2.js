import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

// ... resto do código ...
const SuaTelaPrincipal = () => {
    const [dados, setDados] = useState({
        cliente: '',
        ac: '',
        telefone: '',
        endereco: '',
        cnpj: '',
        dataProposta: '',
        produtos: [], // Inicializa a lista de produtos
    });

    const adicionarProduto = (novosDados) => {
        console.log('Novos Dados:', novosDados);
        setDados(novosDados);
        // Aqui você pode realizar a lógica necessária para lidar com os dados atualizados
    };

    


    return (
        <ScrollView style={styles.container}>
            <Text>Seu componente principal aqui</Text>
            <PropostaForm onAdicionarProduto={adicionarProduto} />
            {/* Renderize os outros componentes conforme necessário */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default SuaTelaPrincipal;