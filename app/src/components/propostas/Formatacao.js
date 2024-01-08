import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Formatacao = ({ placeholder, value, onChangeText, keyboardType, formato }) => {
  const formatarTexto = (text) => {
    const numeros = text.replace(/[^\d]/g, '');
    let textoFormatado = '';
    let index = 0;

    for (let i = 0; i < formato.length && index < numeros.length; i++) {
      const char = formato[i].toLowerCase();
      if (char === 'x') {
        textoFormatado += numeros[index];
        index++;
      } else {
        textoFormatado += char;
      }
    }

    onChangeText(textoFormatado);
  };

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={formatarTexto}
      keyboardType={keyboardType}
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
})

export default Formatacao;
