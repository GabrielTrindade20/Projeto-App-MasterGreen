import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const TextComponent = ({ style, children }) => {
    const styles = {
        defaultStyle: {
            fontSize: 20,
            color: 'black',
            // Defina estilos comuns aqui
        },
        textTitulo: {
            fontSize: 30,
            color: '#000',
            fontWeight: 'bold',
            paddingBottom: 5,

            // Outros estilos
        },
        textSubBranco: {
            fontSize: 25,
            fontWeight: 'bold',
            marginVertical: 2,
            color: '#fff',
            paddingBottom: 5,

            // Outros estilos
        },
        textSubPreto: {
            fontSize: 25,
            fontWeight: 'bold',
            marginVertical: 2,
            color: '#000',
            paddingBottom: 5,

            // Outros estilos
        },
        textInfo: {
            fontSize: 18,
            flexDirection: 'row',
            fontWeight: 'bold',
            marginVertical: 2,
            fontSize: RFValue(15, 680)
            // Outros estilos
        },
    };

    const getStyle = (style) => {
        switch (style) {
            case 'textTitulo':
                return styles.textTitulo;
            case 'textSubBranco':
                return styles.textSubBranco;
            case 'textSubPreto':
                return styles.textSubPreto;
            case 'textInfo':
                return styles.textInfo;
            default:
                return styles.defaultStyle;
        }
    };

    return <Text style={[getStyle(style)]}>{children}</Text>;
};

export default TextComponent;
