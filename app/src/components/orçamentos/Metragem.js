import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";

export default props = () => {
    const [metragem, onChangeMetragem] = React.useState('');

    return (
        <View style={styles.conteiner}>
            <TextComponent style={'textTitulo'}>Metragem (m²)</TextComponent>
            <TextInput
                style={styles.input}
                onChangeText={onChangeMetragem}
                value={metragem}
                placeholder="ex: 10"
                keyboardType="numeric"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    conteiner: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold'
    }
})