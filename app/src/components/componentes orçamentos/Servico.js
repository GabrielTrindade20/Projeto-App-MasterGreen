import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import OpcaoSelecao from '../OpcaoSelecao'
import TextComponent from '../TextComp';

export default function AreaTapq({ choices, setChoices }) {

    const teste = choices;

    const setTeste = (value) => {
        setChoices({ ...choices, teste: value })
    }

    return (
        <View style={styles.container}>
            <TextComponent style='textSubBranco'>Serviço</TextComponent>

            <View style={styles.containerOpcao}>
                <OpcaoSelecao
                    value="Com instalação"
                    selectedValue={teste}
                    onValueChange={(value) => setTeste(value)}
                />
                <Text></Text>
                <OpcaoSelecao
                    value="Sem instalação"
                    selectedValue={teste}
                    onValueChange={(value) => setTeste(value)}
                />
            </View>
        </View>

    )
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
});