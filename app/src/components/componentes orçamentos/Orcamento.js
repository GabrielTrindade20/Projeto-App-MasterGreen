import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TextComponent from '../TextComp';
import Custos from './Custos';
import ValorFinal from './ValorFinal';
import Metragem from './Metragem';

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
        <View style={styles.container}>
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
        </View>
    );
};


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
