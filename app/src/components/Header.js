import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons'


import Menu from './componentes orçamentos/Menu';
import Screens from './navigation/Screens'
import Icon from 'react-native-vector-icons/Ionicons';
// No seu arquivo onde está definido o componente Header
// No seu componente Header
const Header = ({ route }) => {
  const navigation = useNavigation(); // Obtenha a referência à navegação usando useNavigation
  const title = route.name;

  const resetScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: route.name }] // Substitua 'Orçamento' pelo nome da sua tela inicial
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={resetScreen} style={styles.botaoReset}>
        <Ionicons name="refresh-outline" color="#fff" style={styles.icon}/>
      </TouchableOpacity>

      <Text style={styles.titulo}>{title}</Text>

      <View style={styles.containerImg}>
        <Image
          source={require('../imagens/logoSemFundo.png')}
          style={styles.logoMg}
        />
      </View>


    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 70, // Altura do cabeçalho
    borderBottomWidth: 2, // Adiciona uma borda na parte inferior
    borderBottomColor: '#E2E2E2', // Cor da borda
    width: "100%"
  },
  botaoReset: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: 'green',
    borderRadius: 15,
  },
  titulo: {
    flex: 4,
    fontSize: RFValue(30, 680),
    fontWeight: 'bold', // Peso da fonte
    color: '#000', // Cor do texto
    alignItems: 'center',
    textAlign: 'center'
  },
  logoMg: {
    flex: 1,
    width: 80, // Largura da imagem
    height: 80, // Altura da imagem
    marginTop: 10,
    marginRight: 5,
  },
  icon: {
    width: 'auto',
    fontSize: RFPercentage(4.5, 680),
    alignItems: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
});

export default Header;
