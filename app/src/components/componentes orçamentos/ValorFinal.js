import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import TextComponent from "../TextComp";
import Orcamento from "../../screens/Orcamento";

const ValorFinal = ({ custos, valorPorMetro, metragem }) => {
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
        } else {
            setTotalDesconto(0)
            totalLucroEmpresaCalculado = valorFinalClienteCalculado - valorNotaFiscalCalculado - valorServicoCalculado;
        }

        setTotalLucroEmpresa(totalLucroEmpresaCalculado.toFixed(2));
    }, [custos, valorPorMetro, metragem, desconto]);

    return (
        <View style={styles.container}>


            <View style={styles.containerOpcao}>
                <View style={styles.containerCont}>
                    <View style={styles.textOpcoes}>
                        <Text style={styles.textInfo}>CUSTOS</Text>
                        <Text style={[{ color: "#BE1701" }, styles.textValores]}>
                            {parseFloat(valorServico).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <Text style={styles.textInfo}>VALOR FINAL DO CLIENTE</Text>
                        <Text style={[{ color: "#0002B8" }, styles.textValores]}>
                            {parseFloat(valorFinalCliente).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <Text style={styles.textInfo}>VALOR DA NOTA FISCAL</Text>
                        <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                            {parseFloat(valorNotaFiscal).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>


                    <View style={styles.textOpcoes}>
                        <Text style={styles.textInfo}>TOTAL DO DESCONTO</Text>
                        <Text style={[{ color: "#FF9516" }, styles.textValores]}>
                            {parseFloat(totalDesconto).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>

                    <View style={styles.textOpcoes}>
                        <Text style={styles.textInfo}>VALOR DO LUCRO DA EMPRESA</Text>
                        <Text style={[{ color: "#1DAC46" }, styles.textValores]}>
                            {parseFloat(totalLucroEmpresa).toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                </View>
                {/* Adicione as outras seções conforme necessário */}
            </View>
            
            <View style={[{ marginTop: 10, marginBottom: 50 }, styles.containerOpcao]}>
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
        </View>
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
        fontSize: 15,
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



