import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const TextComponent = ({ style, children }) => {
    const styles = {
        valores: {
            fontWeight: 'bold',
            marginVertical: 2,
            fontSize: RFPercentage(2),
            // Defina estilos comuns aqui
        },
        textInfo: {
            fontWeight: 'bold',
            marginVertical: 2,
            fontSize: RFPercentage(2),
            // Outros estilos
        },
        numeros: {
            fontWeight: 'bold',
            marginVertical: 2,
            fontSize: RFPercentage(3, 680)
        },
        titulo: {
            fontWeight: 'bold',
            marginVertical: 2,
            fontSize: RFPercentage(3, 680)
        },
        botao: {
            color: '#FFFFFF', // Cor do texto
            fontSize: RFPercentage(3),
            textAlign: 'center',
            fontWeight: 'bold',
        },
        botao2: {
            color: '#FFFFFF', // Cor do texto
            fontSize: RFPercentage(2),
            textAlign: 'center',
            fontWeight: 'bold',
        }
    };

    const getStyle = (style) => {
        switch (style) {
            case 'textInfo':
                return styles.textInfo;
            case 'valores':
                return styles.valores;
            case 'titulo':
                return styles.titulo;
            case 'botao':
                return styles.botao;
            case 'botao2':
                return styles.botao2;
            default:
                return styles.numeros;
        }
    };

    return <Text style={[getStyle(style)]}>{children}</Text>;
};

export default TextComponent;
