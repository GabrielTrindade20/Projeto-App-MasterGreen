import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const FormatacaoTelefone = ({ placeholder, value, onChangeText }) => {
    const formatarTelefone = (telefone) => {
        const numerosTelefone = telefone.replace(/[^\d]/g, '');

        if (numerosTelefone.length <= 10) {
            return numerosTelefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            const numeroTruncado = numerosTelefone.substring(0, 11);
            return numeroTruncado.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    };

    const formatarTexto = (text) => {
        const textoFormatado = formatarTelefone(text);
        onChangeText(textoFormatado);
    };

    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={formatarTexto}
            keyboardType="numeric"
            style={styles.input}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
        paddingHorizontal: 10,
    },
});

export default FormatacaoTelefone;
