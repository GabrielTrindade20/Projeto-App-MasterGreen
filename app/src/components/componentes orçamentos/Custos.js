import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import TextComponent from '../TextComp';

const Custos = ({ onCustoChange, onValorPorMetroChange }) => {
  const [custo, setCusto] = useState('');
  const [valorPorMetro, setValorPorMetro] = useState('');

  const handleChange = (value, inputType) => {
    const parsedValue = parseFloat(value) || 0;

    // Envie os valores diretamente para os respectivos componentes pai
    if (inputType === 'custo') {
      onCustoChange(parsedValue);
    } else if (inputType === 'valorPorMetro') {
      onValorPorMetroChange(parsedValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerOpcao}>
        <View style={styles.containerCont}>
          <TextComponent style={"textInfo"}>CUSTOS</TextComponent>
          <TextInput
            style={styles.input}
            onChangeText={(number) => handleChange(number, 'custo')}
            placeholder="ex: 10,00"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.containerOpcao}>
        <View style={styles.containerCont}>
          <TextComponent style={"textInfo"}>VALOR POR METRO</TextComponent>
          <TextInput
            style={styles.input}
            onChangeText={(number) => handleChange(number, 'valorPorMetro')}
            placeholder="ex: 10,00"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerOpcao: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  containerCont: {
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 2,
    borderRadius: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default Custos;

