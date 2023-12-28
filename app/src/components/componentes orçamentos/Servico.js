import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OpcaoSelecao from '../OpcaoSelecao';
import TextComponent from '../TextComp';
import ComInstalacao from './ComInstalacao';
import SemInstalacao from './SemInstalacao';
import ValorFinal from './ValorFinal';

export default function Servico({choices, setChoices}) {
    const [escolhaServico, setEscolhaServico] = useState(null);
    const opcoesServico = ['Com instalação', 'Sem instalação'];

    const valorFinal = choices;

    const setValorFinal = (value) => {
        setChoices({...choices, valorFinal: value});
    }

    const calcularValor = () => {
        // Faça os cálculos necessários e atualize o estado
        const novoValorCalculado = // ... faça seus cálculos aqui
        setValorCalculado(novoValorCalculado);
    };

     // Chame a função de cálculo quando necessário
     useEffect(() => {
        calcularValor();
    }, [/* Dependências que acionam o cálculo */]);

    const [dadosComInstalacao, setDadosComInstalacao] = useState({
        deslocamento: '',
        alimentacao: '',
        valorEntrega: '',
        qtdColas: '',
    });

    const onOpcaoChange = (value) => {
        setEscolhaServico(value);
    };

    const handleDadosComInstalacao = (novosDados) => {
        setDadosComInstalacao((prevDados) => ({
            ...prevDados,
            ...novosDados,
        }));
    };

    const comInstalacao = () => {
        // Converta os valores para números antes de somar
        const deslocamento = parseFloat(dadosComInstalacao.deslocamento) || 0;
        const alimentacao = parseFloat(dadosComInstalacao.alimentacao) || 0;
        const valorEntrega = parseFloat(dadosComInstalacao.valorEntrega) || 0;
        const qtdColas = parseFloat(dadosComInstalacao.qtdColas) || 0;

        // Realize a soma
        const somaTotal = deslocamento + alimentacao + valorEntrega + qtdColas;

        somaTotal = valorFinal;
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
                {opcoesServico.map((opcao) => (
                    <OpcaoSelecao
                        key={opcao}
                        value={opcao}
                        selectedValue={escolhaServico}
                        onValueChange={onOpcaoChange}
                    />
                ))}
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
