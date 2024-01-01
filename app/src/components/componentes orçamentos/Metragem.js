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
          <TextComponent style={"textInfo"}>METRAGEM (m²)</TextComponent>
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
})
export default Metragem