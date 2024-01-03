import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
// import { shareAsync } from 'expo-sharing';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import htmlToPdf from 'html-to-pdf-js';

const Proposta = () => {
    const [cliente, setCliente] = useState("")
    const [ac, setAc] = useState("")


    let html = `
    <html>
        <body>
            <h1>Olá ${cliente}</h1>
            <p>seus cuidados estão com ${ac}</p>
        </body>
    </html>
    `;

    // let gerarPDF = async () => {
    //     const file = await Print.printAsync({
    //         html: html,
    //         base64: false
    //     });

    //     await shareAsync(file.uri);
    // };

    const gerarPDF = async () => {
        try {
            const { uri } = await htmlToPdf.generatePDF(html);
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);

            if (status === 'granted') {
                const asset = await MediaLibrary.createAssetAsync(uri);
                await Sharing.shareAsync(asset.uri);
            } else {
                console.error('Permissão de gravação na biblioteca de mídia não concedida.');
            }
        } catch (error) {
            console.error('Erro ao gerar ou compartilhar o PDF:', error);
        }
    };   
    


    return (
        <View>
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

export default Proposta;

