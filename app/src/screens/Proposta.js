import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default teste = () => {


    return (
        <View style={styles.container}>
            <Text style={styles.label}>TELA PROPOSTA</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 25,
        height: 25,
        borderRadius: 35,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff'
    },
    innerCircle: {
        width: 15,
        height: 15,
        borderRadius: 25,
        backgroundColor: 'transparent',
    },
    selectedInnerCircle: {
        backgroundColor: '#0C5AA5',
        width: 18,
        height: 18,
    },
    select: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#0C5AA5',
    },
});

