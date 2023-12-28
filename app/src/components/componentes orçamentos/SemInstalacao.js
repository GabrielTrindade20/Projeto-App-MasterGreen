import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ComInstalacao({ DadosEscolhidos, setDadosEscolha }) {

    const valorEntrega = DadosEscolhidos || {};


    const setValorEntrega = (value) => {
        const parsedValue = parseFloat(value);
        setDadosEscolha({ ...(DadosEscolhidos || {}), valorEntrega: isNaN(parsedValue) ? '' : parsedValue });
    };


    return (
        <View style={styles.container}>
            <View style={styles.containerOpcao}>
                <View style={styles.containerCont}>
                    <Text style={styles.textInfo}>Valor da Entrega</Text>
                    <TextInput
                        style={styles.input}
                        value={valorEntrega}
                        onChangeText={(number) => setValorEntrega(number)}
                        placeholder="ex: 10,00"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: "#fff"
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 10,
        padding: 15,
    },
    containerCont: {
        flex: 1,
        marginRight: 10,
    },
    textInfo: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

