import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

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
            <Text style={styles.textInfo}>CUSTOS</Text>
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
            <Text style={styles.textInfo}>VALOR POR METRO</Text>
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
        marginVertical: 5,
        backgroundColor: "#fff"
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 10,
        padding: 15,
    },
    containerCont: {
        flex: 1,
        marginRight: 10,
    },
    textInfo: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default Custos;

