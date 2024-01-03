import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import Menu from './componentes orçamentos/Menu';
import Screens from './navigation/Screens'
// No seu arquivo onde está definido o componente Header
// No seu componente Header
const Header = ({ navigation, route }) => {

  // const title = route.name
  
  const title = 'Orçamento'
  
  return (
    <View style={styles.container}>
      <View>
        <Menu navigation={navigation}/>
      </View>

      <View>
        <Text style={styles.titulo}>{title}</Text>
      </View>

      <View>
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
    justifyContent: 'space-around',
  },
  logoMg: {
    width: 80, // Largura da imagem
    height: 80, // Altura da imagem
    marginTop: 10,
  },
  titulo: {
    fontSize: 25, // Tamanho da fonte do nome do aplicativo
    fontWeight: 'bold', // Peso da fonte
    color: '#000', // Cor do texto
  },
});

export default Header;
