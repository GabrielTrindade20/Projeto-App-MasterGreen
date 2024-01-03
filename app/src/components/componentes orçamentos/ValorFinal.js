import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

import TextComponent from "../TextComp";
import Orcamento from "../../screens/Orcamento";
import Proposta from "../../screens/Proposta";

const ValorFinal = ({ custos, valorPorMetro, metragem }) => {
    const navigation = useNavigation();

    const [totalLucroEmpresa, setTotalLucroEmpresa] = useState('');
    const [desconto, setDesconto] = useState('');
    const [valorServico, setValorServico] = useState('')
    const [valorNotaFiscal, setValorNotaFiscal] = useState('')
    const [valorFinalCliente, setValorFinalCliente] = useState('')
    const [totalDesconto, setTotalDesconto] = useState('')

    useEffect(() => {
        const valorFinalClienteCalculado = valorPorMetro * metragem;
        const valorNotaFiscalCalculado = (valorFinalClienteCalculado * 4.5) / 100;
        const valorServicoCalculado = custos * metragem;

        setValorFinalCliente(valorFinalClienteCalculado);
        setValorNotaFiscal(valorNotaFiscalCalculado);
        setValorServico(valorServicoCalculado);

        let totalLucroEmpresaCalculado;

        if (desconto !== "") {
            const descontoDecimal = parseFloat(desconto) || 0;
            const valorDesconto = valorFinalClienteCalculado * descontoDecimal / 100;
            setTotalDesconto(valorDesconto)
            totalLucroEmpresaCalculado = valorFinalClienteCalculado - (valorDesconto + valorNotaFiscalCalculado + valorServicoCalculado);
            setValorFinalCliente(valorFinalClienteCalculado - valorDesconto)
        } else {
            setTotalDesconto(0)
            totalLucroEmpresaCalculado = valorFinalClienteCalculado - valorNotaFiscalCalculado - valorServicoCalculado;
        }

        setTotalLucroEmpresa(totalLucroEmpresaCalculado.toFixed(2));
    }, [custos, valorPorMetro, metragem, desconto]);

    const irParaProposta = () => {
        navigation.navigate('Proposta');
    };

    return (
        <View style={styles.container}>


            <View style={styles.containerOpcao}>
                <View style={styles.containerCont}>
                    <View style={styles.textOpcoes}>
                        <TextComponent style={"valores"}>CUSTOS</TextComponent>
                        <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                            {parseFloat(valorServico).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <TextComponent style={"valores"}>VALOR FINAL DO CLIENTE</TextComponent>
                        <Text style={[{ color: "#0002B8" }, styles.textValores]}>
                            {parseFloat(valorFinalCliente).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <TextComponent style={"valores"}>VALOR DA NOTA FISCAL</TextComponent>
                        <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                            {parseFloat(valorNotaFiscal).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>


                    <View style={styles.textOpcoes}>
                        <TextComponent s style={"valores"}>TOTAL DO DESCONTO</TextComponent>
                        <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                            {parseFloat(totalDesconto).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <TextComponent style={"valores"}>VALOR DO LUCRO DA EMPRESA</TextComponent>
                        <Text style={[{ color: "#1DAC46" }, styles.textValores]}>
                            {parseFloat(totalLucroEmpresa).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                </View>
                {/* Adicione as outras seções conforme necessário */}
            </View>

            <View style={[{ marginTop: 10, marginBottom: 20 }, styles.containerOpcao]}>
                <View style={styles.containerCont}>
                    <TextComponent style={"textInfo"}>DESCONTO %</TextComponent>
                    <TextInput
                        style={styles.input}
                        onChangeText={(number) => setDesconto(number)}
                        value={desconto}
                        placeholder="ex: 10"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.botao}
                onPress={irParaProposta}
            >
                <Text style={styles.textoBotao}>Fazer Proposta</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    containerOpcao: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    containerCont: {
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderRadius: 10,
        width: '80%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textOpcoes: {
        marginVertical: 5,
        alignItems: 'center',
    },
    textValores: {
        fontWeight: 'bold',
        marginVertical: 2,
        fontSize: RFPercentage(3),
        // Outros estilos
    },
    botao: {
        backgroundColor: '#138600', // Cor de fundo do botão
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '65%',
        textAlign: "center",
        alignContent: 'center',
        marginVertical: 50,
    },
    textoBotao: {
        color: '#FFFFFF', // Cor do texto
        fontSize: RFPercentage(3),
        textAlign: 'center',
        fontWeight: 'bold',

    },
});

export default ValorFinal;



