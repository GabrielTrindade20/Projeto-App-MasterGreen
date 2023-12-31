import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// No seu arquivo onde está definido o componente Header
// No seu componente Header
const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          source={require('../imagens/icones/iconeMenu.png')}
          style={styles.iconeMenu}
        />
      </TouchableOpacity>

      <Text style={styles.titulo}>Orçamento</Text>

      <Image
        source={require('../imagens/logoSemFundo.png')}
        style={styles.logoMg}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    height: 70, // Altura do cabeçalho
    position: 'sticky',
    top: 0,
    zIndex: 999, // Define a camada do cabeçalho para aparecer acima dos demais conteúdos
    paddingLeft: 20,
    paddingRight: 15,
  },
  logoMg: {
    width: 80, // Largura da imagem
    height: 80, // Altura da imagem
    marginTop: 10,
  },
  iconeMenu: {
    width: 40, // Largura da imagem
    height: 40, // Altura da imagem
  },
  titulo: {
    fontSize: 25, // Tamanho da fonte do nome do aplicativo
    fontWeight: 'bold', // Peso da fonte
    color: '#000', // Cor do texto
}, 
});

export default Header;
