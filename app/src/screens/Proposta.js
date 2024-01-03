import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const PropostaForm = () => {


    return (
        <View>
            <TouchableOpacity style={styles.botao}
                onPress={gerarPDF}            >
                <Text style={styles.label}>Gerar PDF</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    botao: {
        backgroundColor: '#138600', // Cor de fundo do botão
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '65%',
        textAlign: "center",
        alignContent: 'center',
        marginVertical: 50,
    },
    textoBotao: {
        color: '#FFFFFF', // Cor do texto
        fontSize: RFPercentage(3),
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default PropostaForm;

