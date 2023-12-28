import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";
import Servico from "./Servico";

const ValorFinal = () => {
    const [lucroEmpresa, onChangeLucroEmpresa] = React.useState('');
    const [desconto, onChangeDesconto] = React.useState('');

    return (
        <View style={styles.container}>
            <View style={styles.opcoes}>
                <TextComponent style={'textInfo'}>Lucro da Empresa %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeLucroEmpresa}
                    value={lucroEmpresa}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.opcoes}>
                <TextComponent style={'textInfo'}>Desconto %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDesconto}
                    value={desconto}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.containerValFinal}>
                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR BRUTO DO SERVIÇO</Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR FINAL DO CLIENTE</Text>
                    <Text style={[{ color: '#BE1701' }, styles.textValores]}>000.000.000</Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR DA NOTA FISCAL</Text>
                    <Text style={[{ color: '#FF9516' }, styles.textValores]}>000.000.000</Text>
                </View>
                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>LUCRO DA EMPRESA</Text>
                    <Text style={[{ color: '#00AA00' }, styles.textValores]}>000.000.000</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 15,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    opcoes: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 5,
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
    },
    containerValFinal: {
        flexDirection: 'collum',
        alignItems: 'center',
        marginTop: 10,
    },
    textOpcoes: {
        marginVertical: 5,
        alignItems: 'center',
    },
    textInfo: {
        fontSize: 20,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
    },
    textValores: {
        fontSize: 25,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
        // Outros estilos
    },
})

export default ValorFinal;