import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Formatacao = ({ placeholder, value, onChangeText, keyboardType, fomatacao }) => {
  const formatarCPF = (cpf) => {
    const numerosCPF = cpf.replace(/[^\d]/g, '');
    return numerosCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarCNPJ = (cnpj) => {
    const numerosCNPJ = cnpj.replace(/[^\d]/g, '');
    return numerosCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validarCNPJCPF = (documento) => {
    const numeros = (documento || '').replace(/[^\d]/g, '');

    // Limitar o comprimento ao máximo para CPF ou CNPJ
    const maximoCaracteresCPF = 11;
    const maximoCaracteresCNPJ = 14;
    const maximoCaracteresTelefone = 11;

    if (numeros.length <= maximoCaracteresCPF) {
      return formatarCPF(numeros);
    } else if (numeros.length <= maximoCaracteresCNPJ) {
      return formatarCNPJ(numeros);
    } else if (numeros.length <= maximoCaracteresTelefone) {
      return formatarTelefone(numeros);
    } else {
      // Se for maior, trunca o número para o comprimento máximo permitido
      const numeroTruncado = numeros.substring(0, maximoCaracteresCNPJ);
      return formatarCNPJ(numeroTruncado);
    }
  };

  const formatarTelefone = (telefone) => {
    const numerosTelefone = telefone.replace(/[^\d]/g, '');
    return numerosTelefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };


  const formatarTexto = (text) => {
    const documentoFormatado = validarCNPJCPF(text);
    onChangeText(documentoFormatado);
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
