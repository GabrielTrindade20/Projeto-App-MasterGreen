import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';


import PropostaPDF from '../components/propostas/PropostaPDF';


const Orcamento = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
           <PropostaPDF />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: '#002B17',
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 10,
        padding: 15,
    },
    text: {
        fontSize: 25,
        color: '#fff',
    },
});

export default Orcamento;
