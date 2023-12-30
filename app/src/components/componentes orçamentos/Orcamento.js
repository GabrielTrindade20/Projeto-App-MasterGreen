import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import OpcaoSelecao from '../OpcaoSelecao';
import TextComponent from '../TextComp';
import InfoInicial from './InfoInicial'
import ComInstalacao from './ComInstalacao';
import SemInstalacao from './SemInstalacao';
import ValorFinal from './ValorFinal';


const Orcamento = () => {
    const [escolhaServico, setEscolhaServico] = useState(null);
    const [somaComInstalacao, setSomaComInstalacao] = useState(0);

    const [dadosComInstalacao, setDadosComInstalacao] = useState({
        deslocamento: '',
        alimentacao: '',
        valorEntrega: '',
        qtdColas: '',
    });

    const handleSomaComInstalacao = (soma) => {
        setSomaComInstalacao(soma);
    };

    const handleDadosComInstalacao = (novosDados) => {
        setDadosComInstalacao((prevDados) => ({
            ...prevDados,
            ...novosDados,
        }));
    };

    const handleValorCalculado = (soma) => {
        setSomaComInstalacao(soma);
    };



    // Função para renderizar o componente com base na escolha do usuário
    const renderizarComponente = () => {
        switch (escolhaServico) {
            case 'Com instalação':
                return (
                    // <ComInstalacao
                    //     dadosEscolhidos={dadosComInstalacao}
                    //     setDadosEscolha={handleDadosComInstalacao}
                    //     onSomaChange={handleSomaComInstalacao}
                    // />
                    <ComInstalacao
                        dadosEscolhidos={dadosComInstalacao}
                        setDadosEscolha={handleDadosComInstalacao}
                        onSomaChange={handleValorCalculado}
                    />
                );
            case 'Sem instalação':
                return (
                    <SemInstalacao
                        dadosEscolhidos={dadosComInstalacao}
                        setDadosEscolha={handleDadosComInstalacao}
                    />
                );
            default:
                return null;
        }
    };

    const onOpcaoChange = (value) => {
        setEscolhaServico(value);
    };

    return (
        <View style={styles.container}>
            <InfoInicial />

            <TextComponent style="textSubBranco">Serviço</TextComponent>

            <View style={styles.containerOpcao}>
                <OpcaoSelecao
                    value="Com instalação"
                    selectedValue={escolhaServico}
                    onValueChange={onOpcaoChange}
                />
                <OpcaoSelecao
                    value="Sem instalação"
                    selectedValue={escolhaServico}
                    onValueChange={onOpcaoChange}
                />
            </View>

            {renderizarComponente()}
            {/* Mostrar a soma ao usuário */}
            <View style={styles.resultadoContainer}>
                <TextComponent style="textSubBranco">Resultado:</TextComponent>
                <TextComponent style="textSubBranco">{somaComInstalacao}</TextComponent>
            </View>
            {/* Passa o valor calculado para o componente ValorFinal */}

            <ValorFinal somaComInstalacao={somaComInstalacao} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 10,
        padding: 15,
    },
    text: {
        fontSize: 25,
        color: '#fff',
    },
});

export default Orcamento;
