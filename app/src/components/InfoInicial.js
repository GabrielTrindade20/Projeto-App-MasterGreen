import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';

export default props => {
  const [priority, setPriority] = useState('');

  const priorityOptions = [
    { label: 'Alta', value: 'high' },
    { label: 'Média', value: 'medium' },
    { label: 'Baixa', value: 'low' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
          style={styles.picker}
          mode={'dropdown'}
        >
          {priorityOptions.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={priority}
          onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
          style={styles.picker}
          mode={'dropdown'}
        >
          {priorityOptions.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'purple',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    width: '45%',
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
