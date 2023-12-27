import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import OpcaoSelecao from '../RadioOpcao'

export default function AreaTapq({ choices, setChoices }) {

    const teste = choices;

    const setTeste = (value) => {
        setChoices({ ...choices, teste: value })
    }

    return (
        <View>
            <Text style='textQuestoes'></Text>
            <OpcaoSelecao
                value="Sim"
                selectedValue={teste}
                onValueChange={(value) => setTeste(value)}
            />
            <OpcaoSelecao
                value="Não"
                selectedValue={teste}
                onValueChange={(value) => setTeste(value)}
            />
        </View>

    )
}