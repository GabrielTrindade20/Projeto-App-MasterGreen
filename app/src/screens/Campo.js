import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

const larguraDaTela = Dimensions.get('window').width;
const alturaDaTela = Dimensions.get('window').height;


export default props => {
    return (
        <View style={styles.container}>
            <Image source={require('../imagens/campo.jpg')} style={styles.imagemEstilo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemEstilo: {
        width: larguraDaTela,
        height: alturaDaTela, // Defina a altura desejada
        resizeMode: 'contain', // Ou use 'cover' para cobrir o componente Image
    },
});
