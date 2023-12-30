import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";

const Metragem = ({ onMetragemChange }) => {
    const [metragem, setMetragem] = useState('');
  
    useEffect(() => {
      const metragemFloat = parseFloat(metragem);
      if (!isNaN(metragemFloat)) {
        onMetragemChange(metragemFloat);
      }
    }, [metragem, onMetragemChange]);
  
    return (
      <View style={styles.container}>
        <View style={styles.containerOpcao}>
          <View style={styles.containerCont}>
            <Text style={styles.textInfo}>METRAGEM (m²)</Text>
            <TextInput
              style={styles.input}
              onChangeText={setMetragem}
              value={metragem}
              placeholder="ex: 10"
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
})
export default Metragem