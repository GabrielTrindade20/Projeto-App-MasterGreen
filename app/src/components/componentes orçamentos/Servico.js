import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OpcaoSelecao from '../OpcaoSelecao';
import TextComponent from '../TextComp';
import ComInstalacao from './ComInstalacao';
import SemInstalacao from './SemInstalacao';
import ValorFinal from './ValorFinal';

export default Servico = () => {
    const [escolhaServico, setEscolhaServico] = useState(null);
    const [dadosComInstalacao, setDadosComInstalacao] = useState({
        deslocamento: '',
        alimentacao: '',
        valorEntrega: '',
        qtdColas: '',
    });

    const handleDadosComInstalacao = (novosDados) => {
        setDadosComInstalacao((prevDados) => ({
            ...prevDados,
            ...novosDados,
        }));
    };

    // Chame a função de cálculo quando necessário
    const calcularValor = () => {
        // Faça os cálculos necessários e atualize o estado
        const novoValorCalculado = // ... faça seus cálculos aqui
            setValorCalculado(novoValorCalculado);
    };


    const onOpcaoChange = (value) => {
        setEscolhaServico(value);
    };



    const comInstalacao = () => {
        // Converta os valores para números antes de somar
        const deslocamento = parseFloat(dadosComInstalacao.deslocamento) || 0;
        const alimentacao = parseFloat(dadosComInstalacao.alimentacao) || 0;
        const valorEntrega = parseFloat(dadosComInstalacao.valorEntrega) || 0;
        const qtdColas = parseFloat(dadosComInstalacao.qtdColas) || 0;

        // Realize a soma
        const somaTotal = deslocamento + alimentacao + valorEntrega + qtdColas;

        return somaTotal;
    };

    useEffect(() => {
        // Cleanup effect: redefine os dados quando o componente é desmontado
        return () => {
            setDadosComInstalacao({
                deslocamento: '',
                alimentacao: '',
                valorEntrega: '',
                qtdColas: '',
            });
        };
    }, [escolhaServico]); // Executado sempre que escolhaServico muda

    return (
        <View style={styles.container}>
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

            {escolhaServico === 'Com instalação' ? (
                <ComInstalacao
                    dadosEscolhidos={dadosComInstalacao}
                    setDadosEscolha={handleDadosComInstalacao}
                />
            ) : escolhaServico === 'Sem instalação' ? (
                <SemInstalacao
                    dadosEscolhidos={dadosComInstalacao}
                    setDadosEscolha={handleDadosComInstalacao}
                />
            ) : null}
            {/* Mostrar a soma ao usuário */}
            <View style={styles.resultadoContainer}>
                <TextComponent style="textSubBranco">Resultado:</TextComponent>
                <TextComponent style="textSubBranco">{comInstalacao()}</TextComponent>
            </View>
            {/* Passa o valor calculado para o componente ValorFinal */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
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
