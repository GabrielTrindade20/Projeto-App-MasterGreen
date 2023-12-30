import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';

import InfoInicial from "./InfoInicial";
import Metragem from "./Metragem";
import Servico from "./Orcamento";
import ValorFinal from "./ValorFinal";

export default Orcamento => {
    return (
        <View style={styles.container}>
            <InfoInicial />
            <Metragem />
            <Servico />
            <ValorFinal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },   
});

