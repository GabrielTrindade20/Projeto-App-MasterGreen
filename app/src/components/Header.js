import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


import Menu from './componentes orçamentos/Menu';
import Screens from './navigation/Screens'
// No seu arquivo onde está definido o componente Header
// No seu componente Header
const Header = ({ navigation, route }) => {

  const title = route.name


  return (
    <View style={styles.container}>
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
    justifyContent: 'space-evenly',
    borderBottomWidth: 2, // Adiciona uma borda na parte inferior
    borderBottomColor: '#E2E2E2', // Cor da borda
  },
  logoMg: {
    width: 80, // Largura da imagem
    height: 80, // Altura da imagem
    marginTop: 10,
  },
  titulo: {
    fontSize: RFValue(30, 680),
    fontWeight: 'bold', // Peso da fonte
    color: '#000', // Cor do texto
  },
});

export default Header;
