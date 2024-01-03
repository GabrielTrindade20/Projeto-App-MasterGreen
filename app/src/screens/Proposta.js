import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Teste1 from '../components/propostas/teste1'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useState, useEffect } from 'react';

const PropostaForm = ({ onAdicionarProduto }) => {
    const [htmlString, setHtmlString] = useState('');

    // Assume que escopoProposta.js está no mesmo diretório do componente
    const filePath = './escopoProposta.js';

    useEffect(() => {
        const carregarHtmlExterno = async () => {
            try {
                const response = await fetch(filePath);
                const htmlContent = await response.text();
                setHtmlString(htmlContent);
            } catch (error) {
                console.error('Erro ao carregar o arquivo HTML externo:', error);
            }
        };
    
        carregarHtmlExterno();
    }, []);
    

    const gerarPDF = async () => {
        if (!htmlString) {
            console.error('Conteúdo HTML não carregado.');
            return;
        }

        const options = {
            html: htmlString,
            fileName: 'proposta',
            directory: 'Documents',
        };

        try {
            const file = await RNHTMLtoPDF.convert(options);
            console.log('Caminho do arquivo PDF gerado:', file.filePath);
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.botao}
                onPress={gerarPDF}            >
                <Text style={styles.label}>Gerar PDF</Text>
            </TouchableOpacity>

            <Teste1 />

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

