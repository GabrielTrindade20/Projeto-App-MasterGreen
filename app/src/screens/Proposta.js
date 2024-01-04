import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { gerarHTML } from '../components/propostas/escopo'


const TelaPDF = () => {
    const [cliente, setCliente] = useState("");
    const [ac, setAc] = useState("");
    // const caminhoDoHTML = '../components/propostas/banner.png';

    const gerarPDF = async () => {
      // Use a função gerarHTML do arquivo escopo.js para gerar o HTML com os dados
      const html = gerarHTML(cliente, ac, caminhoDoHTML);
  
      
      // Imprimir o PDF
      const pdf = await Print.printAsync({ html, base64: true });
    //   await shareAsync(pdf.uri);
    };


    return (
        <View style={styles.container}>
            <Text>tela do pdf</Text>
            <TextInput
                placeholder="Cliente"
                value={cliente}
                onChangeText={(text) => setCliente(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="A/C"
                value={ac}
                onChangeText={(text) => setAc(text)}
                style={styles.input}
            />
            <TouchableOpacity
                style={styles.botao}
                onPress={gerarPDF}
            >
                <Text style={styles.textoBotao}>Gerar PDF</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botao: {
        backgroundColor: '#138600',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '65%',
        textAlign: "center",
        alignContent: 'center',
        marginVertical: 50,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: RFPercentage(3),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default TelaPDF;