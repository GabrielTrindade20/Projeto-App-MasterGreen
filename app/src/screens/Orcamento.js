import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import TextComponent from '../components/TextComp';
import Custos from '../components/componentes orçamentos/Custos';
import ValorFinal from '../components/componentes orçamentos/ValorFinal';
import Metragem from '../components/componentes orçamentos/Metragem';

const Orcamento = () => {
    const [custo, setCusto] = useState(0);
    const [valorPorMetro, setValorPorMetro] = useState(0);
    const [metragem, setMetragem] = useState(0);

    const handleMetragemChange = (metragem) => {
        setMetragem(metragem);
    };

    const handleCustoChange = (custo) => {
        setCusto(custo);
    };

    const handleValorPorMetroChange = (valorPorMetro) => {
        setValorPorMetro(valorPorMetro);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Custos
                onCustoChange={handleCustoChange}
                onValorPorMetroChange={handleValorPorMetroChange}
            />

            <Metragem onMetragemChange={handleMetragemChange} />

            <ValorFinal
                custos={custo}
                valorPorMetro={valorPorMetro}
                metragem={metragem}
            />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: '#002B17',
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
