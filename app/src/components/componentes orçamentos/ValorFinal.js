import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";
import Orcamento from "./Orcamento";

const ValorFinal = ({ custos, valorPorMetro, metragem }) => {

    const valorServico = custos * metragem;
    const valorFinalCliente = valorPorMetro * metragem
    const valorNotafiscal = valorFinalCliente * 4.5 / 100
    const totalLucroEmpresa = valorFinalCliente - valorNotafiscal
    const desconto = 0




    return (
        <View style={styles.container}>
            {/* <View style={styles.opcoes}>
                <TextComponent style={"textInfo"}>Lucro da Empresa %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={(number) => setLucroEmpresa(number)}
                    value={String(lucroEmpresa)}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View> */}

            <View style={styles.opcoes}>
                <TextComponent style={"textInfo"}>Desconto %</TextComponent>
                <TextInput
                    style={styles.input}
                    onChangeText={(number) => setDesconto(number)}
                    value={String(desconto)}
                    placeholder="ex: 10"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.containerValFinal}>
                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>CUSTOS</Text>
                    <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                        {parseFloat(valorServico).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR FINAL DO CLIENTE</Text>
                    <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                        {parseFloat(valorFinalCliente).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR DA NOTA FISCAL</Text>
                    <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                        {parseFloat(valorNotafiscal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>

                <View style={styles.textOpcoes}>
                    <Text style={styles.textInfo}>VALOR DO LUCRO DA EMPRESA</Text>
                    <Text style={[{ color: "#1DAC46" }, styles.textValores]}>
                        {parseFloat(totalLucroEmpresa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>


                {/* Adicione as outras seções conforme necessário */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 15,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
    },
    opcoes: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 5,
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold'
    },
    containerValFinal: {
        flexDirection: 'collum',
        alignItems: 'center',
        marginTop: 10,
    },
    textOpcoes: {
        marginVertical: 5,
        alignItems: 'center',
    },
    textInfo: {
        fontSize: 20,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
    },
    textValores: {
        fontSize: 25,
        flexDirection: 'row',
        fontWeight: 'bold',
        marginVertical: 2,
        // Outros estilos
    },
})

export default ValorFinal;



