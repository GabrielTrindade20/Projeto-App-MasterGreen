import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';

import TextComp from '../TextComp'

export default function OpcoesGrama(dadosEscolhidos, setDadosEscolhidos) {
  // const [tipoGrama, setTipoGrama] = useState('');
  // const [fornecedorGrama, setfornecedorGrama] = useState('');

  const {
    tipoGrama,
    fornecedorGrama
  } = dadosEscolhidos

  const setTipoGrama = (value) => {
    setTipoGrama({...dadosEscolhidos, tipoGrama: value})
  }

  const setfornecedorGrama = (value) => {
    setfornecedorGrama({...dadosEscolhidos, fornecedorGrama: value})
  }

  const opcoesGrama = [
    { label: '22 mm', value: 'high' },
    { label: '50 mm', value: 'medium' },
    { label: '30 mm', value: 'low' },
  ];

  const fornecedores = [
    { label: 'Antonio', value: 'high' },
    { label: 'Confra LTDA', value: 'medium' },
    { label: 'Leroy Merlyn', value: 'low' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.containerComp}>
        <TextComp style={'textSubBranco'}>Tipo de Grama</TextComp>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoGrama}
            onValueChange={(value) => setTipoGrama(value)}
            style={styles.picker}
            mode={'dropdown'}
          >
            {opcoesGrama.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.containerComp}>
        <TextComp style={'textSubBranco'}>Fornecedor</TextComp>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fornecedorGrama}
            onValueChange={(value) => setFornecedorGrama(value)}
            style={styles.picker}
            mode={'dropdown'}
          >
            {fornecedores.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,

  },
  containerComp: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    width: 180,
    borderRadius: 5, // Borda arredondada
    overflow: 'hidden', // Para garantir que as bordas arredondadas sejam aplicadas corretamente
    elevation: 3, // Sombra (funciona no Android)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  }
});
